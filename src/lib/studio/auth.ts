import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from 'node:crypto'
import { z } from 'zod'
import { audit, type StudioDatabase } from './database'
import { StudioError } from './errors'

export const roles = ['admin', 'editor', 'seo', 'viewer'] as const
export type Role = (typeof roles)[number]
export type Capability =
  | 'content.read'
  | 'content.write'
  | 'content.publish'
  | 'seo.write'
  | 'media.write'
  | 'ai.use'
  | 'settings.write'
  | 'users.manage'
  | 'audit.read'
export type StudioUser = {
  id: string
  email: string
  name: string
  role: Role
  status: 'active' | 'disabled'
  revision: string
}
type UserRow = Omit<StudioUser, 'revision'> & {
  password_hash: string
  updated_at: string
}

const grants: Record<Role, readonly Capability[]> = {
  admin: [
    'content.read',
    'content.write',
    'content.publish',
    'seo.write',
    'media.write',
    'ai.use',
    'settings.write',
    'users.manage',
    'audit.read',
  ],
  editor: ['content.read', 'content.write', 'media.write', 'ai.use'],
  seo: ['content.read', 'seo.write', 'ai.use'],
  viewer: ['content.read'],
}
export const can = (
  user: Pick<StudioUser, 'role' | 'status'>,
  capability: Capability,
) => user.status === 'active' && !!grants[user.role]?.includes(capability)
export function requireCapability(
  user: Pick<StudioUser, 'role' | 'status'>,
  capability: Capability,
) {
  if (!can(user, capability))
    throw new StudioError(
      403,
      'Tài khoản không có quyền thực hiện thao tác này.',
      'FORBIDDEN',
    )
}
const inputSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  name: z.string().trim().min(2).max(100),
  password: z.string().min(12, 'Mật khẩu cần ít nhất 12 ký tự.').max(256),
})
const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex')
const safeUser = (user: UserRow): StudioUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  status: user.status,
  revision: user.updated_at,
})
let activeDerivations = 0
async function derive(password: string, salt: string): Promise<Buffer> {
  if (activeDerivations >= 4)
    throw new StudioError(
      429,
      'Máy chủ đang xử lý nhiều yêu cầu đăng nhập. Vui lòng thử lại sau.',
      'HASH_CAPACITY',
    )
  activeDerivations += 1
  try {
    return await new Promise<Buffer>((resolve, reject) =>
      scrypt(
        password,
        salt,
        64,
        { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
        (error, key) => (error ? reject(error) : resolve(key)),
      ),
    )
  } finally {
    activeDerivations -= 1
  }
}
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  return `scrypt$${salt}$${(await derive(password, salt)).toString('hex')}`
}
async function checkPassword(password: string, hash: string) {
  const [algorithm, salt, encoded] = hash.split('$')
  if (algorithm !== 'scrypt' || !salt || !encoded) return false
  const expected = Buffer.from(encoded, 'hex')
  const actual = await derive(password, salt)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export class StudioAuth {
  constructor(private db: StudioDatabase) {}

  private authorizeCurrent(
    actor: StudioUser,
    capability: Capability,
    sessionToken?: string,
  ) {
    const current =
      sessionToken !== undefined
        ? this.session(sessionToken)
        : (this.db
            .prepare('SELECT * FROM studio_users WHERE id = ?')
            .get(actor.id) as UserRow | undefined)
    if (!current || current.id !== actor.id || current.status !== 'active')
      throw new StudioError(
        401,
        'Phiên đăng nhập không còn hợp lệ.',
        'UNAUTHENTICATED',
      )
    requireCapability(current, capability)
  }

  needsSetup() {
    return !this.db.prepare('SELECT id FROM studio_users LIMIT 1').get()
  }

  async setupOwner(input: unknown, token: string, configuredToken: string) {
    if (configuredToken.length < 32)
      throw new StudioError(
        503,
        'Mã khởi tạo chưa được cấu hình trên máy chủ.',
        'SETUP_UNCONFIGURED',
      )
    if (
      !timingSafeEqual(
        Buffer.from(digest(token)),
        Buffer.from(digest(configuredToken)),
      )
    )
      throw new StudioError(403, 'Mã khởi tạo không hợp lệ.', 'SETUP_TOKEN')
    const data = inputSchema.parse(input)
    const passwordHash = await hashPassword(data.password)
    return this.db.transaction(() => {
      if (!this.needsSetup())
        throw new StudioError(
          409,
          'Hệ thống đã được khởi tạo.',
          'SETUP_COMPLETE',
        )
      const user: StudioUser = {
        id: randomUUID(),
        email: data.email,
        name: data.name,
        role: 'admin',
        status: 'active',
        revision: new Date().toISOString(),
      }
      this.insertUser(user, passwordHash)
      audit(this.db, user.id, 'setup.completed', user.id)
      return user
    })()
  }

  private insertUser(user: StudioUser, passwordHash: string) {
    const now = user.revision
    this.db
      .prepare(
        'INSERT INTO studio_users (id,email,name,password_hash,role,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)',
      )
      .run(
        user.id,
        user.email,
        user.name,
        passwordHash,
        user.role,
        user.status,
        now,
        now,
      )
  }

  async createUser(actor: StudioUser, input: unknown, sessionToken?: string) {
    this.authorizeCurrent(actor, 'users.manage', sessionToken)
    const data = inputSchema.extend({ role: z.enum(roles) }).parse(input)
    const passwordHash = await hashPassword(data.password)
    return this.db.transaction(() => {
      this.authorizeCurrent(actor, 'users.manage', sessionToken)
      if (
        this.db
          .prepare('SELECT id FROM studio_users WHERE email = ?')
          .get(data.email)
      )
        throw new StudioError(409, 'Email đã được sử dụng.', 'DUPLICATE_EMAIL')
      const user: StudioUser = {
        id: randomUUID(),
        email: data.email,
        name: data.name,
        role: data.role,
        status: 'active',
        revision: new Date().toISOString(),
      }
      this.insertUser(user, passwordHash)
      audit(this.db, actor.id, 'user.created', user.id, { role: user.role })
      return user
    })()
  }

  updateUser(
    actor: StudioUser,
    id: string,
    input: unknown,
    expectedRevision: string,
    sessionToken?: string,
  ) {
    const changes = z
      .object({
        name: z.string().trim().min(2).max(100).optional(),
        role: z.enum(roles).optional(),
        status: z.enum(['active', 'disabled']).optional(),
      })
      .strict()
      .parse(input)
    return this.db.transaction(() => {
      this.authorizeCurrent(actor, 'users.manage', sessionToken)
      const existing = this.db
        .prepare('SELECT * FROM studio_users WHERE id = ?')
        .get(id) as UserRow | undefined
      if (!existing) throw new StudioError(404, 'Không tìm thấy tài khoản.')
      if (existing.updated_at !== expectedRevision)
        throw new StudioError(
          409,
          'Tài khoản đã được người khác cập nhật. Đối chiếu phiên bản mới trước khi lưu.',
          'VERSION_CONFLICT',
        )
      // Persist a strictly increasing stamp even for same-millisecond or backward-clock updates.
      const revision = new Date(
        Math.max(Date.now(), Date.parse(existing.updated_at) + 1),
      ).toISOString()
      const next = { ...safeUser(existing), ...changes, revision }
      if (
        existing.role === 'admin' &&
        existing.status === 'active' &&
        (next.role !== 'admin' || next.status !== 'active')
      ) {
        const { count } = this.db
          .prepare(
            "SELECT COUNT(*) AS count FROM studio_users WHERE role = 'admin' AND status = 'active'",
          )
          .get() as { count: number }
        if (count <= 1)
          throw new StudioError(
            409,
            'Không thể thay đổi quyền hoặc khóa quản trị viên cuối cùng.',
            'LAST_ADMIN',
          )
      }
      this.db
        .prepare(
          'UPDATE studio_users SET name = ?, role = ?, status = ?, updated_at = ? WHERE id = ?',
        )
        .run(next.name, next.role, next.status, revision, id)
      this.db.prepare('DELETE FROM studio_sessions WHERE user_id = ?').run(id)
      audit(this.db, actor.id, 'user.updated', id, changes)
      return next
    })()
  }

  listUsers(actor: StudioUser) {
    this.authorizeCurrent(actor, 'users.manage')
    return (
      this.db
        .prepare('SELECT * FROM studio_users ORDER BY created_at')
        .all() as UserRow[]
    ).map(safeUser)
  }

  consumeLimit(bucket: string, limit = 10, windowMs = 15 * 60 * 1000) {
    const now = Date.now()
    this.db.transaction(() => {
      this.db
        .prepare('DELETE FROM studio_rate_limits WHERE resets_at <= ?')
        .run(now)
      const key = digest(bucket)
      const row = this.db
        .prepare('SELECT attempts FROM studio_rate_limits WHERE bucket = ?')
        .get(key) as { attempts: number } | undefined
      if (row && row.attempts >= limit)
        throw new StudioError(
          429,
          'Đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút.',
          'RATE_LIMIT',
        )
      this.db
        .prepare(
          'INSERT INTO studio_rate_limits (bucket,attempts,resets_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts = attempts + 1',
        )
        .run(key, now + windowMs)
    })()
  }

  async login(
    email: string,
    password: string,
    client: string | null,
    remember = false,
  ) {
    const normalized = email.trim().toLowerCase()
    this.consumeLimit(`login-account:${normalized}`)
    if (client) this.consumeLimit(`login-client:${client}`, 60)
    const user = this.db
      .prepare('SELECT * FROM studio_users WHERE email = ?')
      .get(normalized) as UserRow | undefined
    // Unknown accounts still pay the same password-derivation cost.
    const valid = await checkPassword(
      password,
      user?.password_hash ?? `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`,
    )
    if (!user || !valid || user.status !== 'active')
      throw new StudioError(
        401,
        'Email hoặc mật khẩu không đúng.',
        'INVALID_CREDENTIALS',
      )
    const token = randomBytes(32).toString('base64url')
    const maxAge = remember ? 7 * 24 * 60 * 60 : 8 * 60 * 60
    const current = this.db.transaction(() => {
      const fresh = this.db
        .prepare('SELECT * FROM studio_users WHERE id = ?')
        .get(user.id) as UserRow | undefined
      if (
        !fresh ||
        fresh.status !== 'active' ||
        fresh.password_hash !== user.password_hash
      )
        throw new StudioError(
          401,
          'Email hoặc mật khẩu không đúng.',
          'INVALID_CREDENTIALS',
        )
      this.db
        .prepare('DELETE FROM studio_sessions WHERE expires_at <= ?')
        .run(Date.now())
      this.db
        .prepare(
          'INSERT INTO studio_sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)',
        )
        .run(
          digest(token),
          user.id,
          Date.now() + maxAge * 1000,
          new Date().toISOString(),
        )
      this.db
        .prepare('DELETE FROM studio_rate_limits WHERE bucket = ?')
        .run(digest(`login-account:${normalized}`))
      audit(this.db, user.id, 'session.created', user.id)
      return safeUser(fresh)
    })()
    return { user: current, token, maxAge }
  }

  session(token: string | undefined): StudioUser | null {
    if (!token || !/^[a-zA-Z0-9_-]{43}$/.test(token)) return null
    const user = this.db
      .prepare(
        "SELECT u.* FROM studio_sessions s JOIN studio_users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.status = 'active'",
      )
      .get(digest(token), Date.now()) as UserRow | undefined
    return user ? safeUser(user) : null
  }

  logout(token: string | undefined) {
    if (!token) return
    const user = this.session(token)
    this.db.transaction(() => {
      this.db
        .prepare('DELETE FROM studio_sessions WHERE token_hash = ?')
        .run(digest(token))
      if (user) audit(this.db, user.id, 'session.revoked', user.id)
    })()
  }
}
