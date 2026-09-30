import { afterEach, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth, can } from '../../src/lib/studio/auth'

let directory: string
let db: ReturnType<typeof openStudioDatabase>
let auth: StudioAuth
const bootstrap = 'test-bootstrap-token-with-at-least-32-characters'
const ownerInput = {
  email: 'owner@example.test',
  name: 'TBS Owner',
  password: 'Owner-password-test-728!',
}

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'tbs-studio-test-'))
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
})
afterEach(() => {
  db.close()
  rmSync(directory, { recursive: true, force: true })
})

test('setup requires a private bootstrap token and can only create one initial owner', async () => {
  await assert.rejects(
    auth.setupOwner(ownerInput, 'wrong', bootstrap),
    /Mã khởi tạo/,
  )
  await assert.rejects(
    auth.setupOwner(ownerInput, '', ''),
    /chưa được cấu hình/,
  )
  const owner = await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  assert.equal(owner.role, 'admin')
  assert.equal('passwordHash' in owner, false)
  await assert.rejects(
    auth.setupOwner(
      { ...ownerInput, email: 'second@example.test' },
      bootstrap,
      bootstrap,
    ),
    /đã được khởi tạo/,
  )
  const stored = db.prepare('SELECT password_hash FROM studio_users').get() as {
    password_hash: string
  }
  assert.notEqual(stored.password_hash, ownerInput.password)
  assert.match(stored.password_hash, /^scrypt\$/)
})

test('login checks actual credentials, returns an opaque session and revokes it on logout', async () => {
  await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  await assert.rejects(
    auth.login(ownerInput.email, 'admin123', 'local'),
    /không đúng/,
  )
  const login = await auth.login(
    'OWNER@example.test',
    ownerInput.password,
    'local',
  )
  assert.equal(auth.session(login.token)?.email, ownerInput.email)
  assert.equal(login.token.split('.').length, 1)
  const stored = db.prepare('SELECT token_hash FROM studio_sessions').get() as {
    token_hash: string
  }
  assert.notEqual(stored.token_hash, login.token)
  assert.equal(auth.session('demo_token_fake'), null)
  auth.logout(login.token)
  assert.equal(auth.session(login.token), null)
})

test('passwords and valid sessions survive opening a new database connection', async () => {
  await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  const login = await auth.login(ownerInput.email, ownerInput.password, 'local')
  db.close()
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
  assert.equal(auth.session(login.token)?.email, ownerInput.email)
  const next = await auth.login(ownerInput.email, ownerInput.password, 'local')
  assert.notEqual(next.token, login.token)
})

test('sessions expire and use the current database role/status, not client claims', async () => {
  const owner = await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  const editor = await auth.createUser(owner, {
    email: 'editor@example.test',
    name: 'Editor',
    password: 'Editor-password-test-728!',
    role: 'editor',
  })
  const login = await auth.login(
    editor.email,
    'Editor-password-test-728!',
    'local',
  )
  assert.equal(can(auth.session(login.token)!, 'users.manage'), false)
  assert.equal(can(auth.session(login.token)!, 'content.write'), true)
  db.prepare('UPDATE studio_users SET role = ? WHERE id = ?').run(
    'viewer',
    editor.id,
  )
  assert.equal(can(auth.session(login.token)!, 'content.write'), false)
  db.prepare('UPDATE studio_users SET status = ? WHERE id = ?').run(
    'disabled',
    editor.id,
  )
  assert.equal(auth.session(login.token), null)
  db.prepare('UPDATE studio_users SET status = ? WHERE id = ?').run(
    'active',
    editor.id,
  )
  db.prepare('UPDATE studio_sessions SET expires_at = 0').run()
  assert.equal(auth.session(login.token), null)
})

test('editor cannot create users and the last active admin cannot be disabled or demoted', async () => {
  const owner = await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  const editor = await auth.createUser(owner, {
    email: 'editor@example.test',
    name: 'Editor',
    password: 'Editor-password-test-728!',
    role: 'editor',
  })
  await assert.rejects(
    auth.createUser(editor, {
      email: 'other@example.test',
      name: 'Other',
      password: 'Other-password-test-728!',
      role: 'admin',
    }),
    /quyền/,
  )
  assert.throws(
    () => auth.updateUser(owner, owner.id, { role: 'viewer' }, owner.revision),
    /quản trị viên cuối/,
  )
  assert.throws(
    () =>
      auth.updateUser(owner, owner.id, { status: 'disabled' }, owner.revision),
    /quản trị viên cuối/,
  )
})

test('target-user revisions reject stale writes without revoking fresh sessions or auditing them', async () => {
  const owner = await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  const editor = await auth.createUser(owner, {
    email: 'conflict@example.test',
    name: 'Editor conflict',
    password: 'Editor-password-test-728!',
    role: 'editor',
  })
  assert.equal(typeof editor.revision, 'string')
  const now = Date.now
  let changed: typeof editor
  try {
    Date.now = () => Date.parse(editor.revision) - 1000
    changed = auth.updateUser(
      owner,
      editor.id,
      { role: 'viewer' },
      editor.revision,
    )
    assert.ok(changed.revision > editor.revision)
    changed = auth.updateUser(
      owner,
      editor.id,
      { name: 'Updated editor' },
      changed.revision,
    )
    assert.equal(Date.parse(changed.revision), Date.parse(editor.revision) + 2)
  } finally {
    Date.now = now
  }
  const login = await auth.login(
    editor.email,
    'Editor-password-test-728!',
    null,
  )
  const before = db.prepare('SELECT * FROM studio_audit').all()
  for (const changes of [{ role: 'admin' }, { status: 'disabled' }])
    assert.throws(
      () => auth.updateUser(owner, editor.id, changes, editor.revision),
      { code: 'VERSION_CONFLICT', status: 409 },
    )
  assert.deepEqual(auth.session(login.token), changed!)
  assert.deepEqual(db.prepare('SELECT * FROM studio_audit').all(), before)
  db.exec(
    "CREATE TRIGGER user_audit_abort BEFORE INSERT ON studio_audit BEGIN SELECT RAISE(ABORT, 'fixture'); END",
  )
  assert.throws(() =>
    auth.updateUser(owner, editor.id, { role: 'editor' }, changed!.revision),
  )
  assert.deepEqual(auth.session(login.token), changed!)
  assert.deepEqual(
    auth.listUsers(owner).find((user) => user.id === editor.id),
    changed!,
  )
  db.exec('DROP TRIGGER user_audit_abort')
  const final = auth.updateUser(
    owner,
    editor.id,
    { role: 'editor' },
    changed!.revision,
  )
  assert.equal(auth.session(login.token), null)
  assert.ok(final.revision > changed!.revision)
  db.close()
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
  assert.deepEqual(
    auth.listUsers(owner).find((user) => user.id === editor.id),
    final,
  )
})

test('login attempts are rate limited in persistent storage without leaking account existence', async () => {
  for (let index = 0; index < 10; index++) {
    await assert.rejects(
      auth.login('unknown@example.test', 'wrong', 'local'),
      /không đúng/,
    )
  }
  await assert.rejects(
    auth.login('unknown@example.test', 'wrong', 'local'),
    /thử quá nhiều/,
  )
  const audits = JSON.stringify(db.prepare('SELECT * FROM studio_audit').all())
  assert.equal(audits.includes('Owner-password'), false)
})

test('a stale administrator snapshot cannot promote itself after demotion', async () => {
  const owner = await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  const second = await auth.createUser(owner, {
    email: 'second@example.test',
    name: 'Second admin',
    password: 'Second-password-test-728!',
    role: 'admin',
  })
  auth.updateUser(second, owner.id, { role: 'viewer' }, owner.revision)
  assert.throws(
    () => auth.updateUser(owner, owner.id, { role: 'admin' }, owner.revision),
    /quyền/,
  )
})

test('logout during an asynchronous mutation prevents its eventual commit', async () => {
  const owner = await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  const login = await auth.login(owner.email, ownerInput.password, 'local')
  const pending = auth.createUser(
    owner,
    {
      email: 'late@example.test',
      name: 'Late user',
      password: 'Late-password-test-728!',
      role: 'admin',
    },
    login.token,
  )
  auth.logout(login.token)
  await assert.rejects(pending, /Phiên đăng nhập/)
  assert.equal(
    db
      .prepare('SELECT id FROM studio_users WHERE email = ?')
      .get('late@example.test'),
    undefined,
  )
})

test('unidentified client failures across other identities cannot lock every account', async () => {
  await auth.setupOwner(ownerInput, bootstrap, bootstrap)
  for (let index = 0; index < 60; index++) {
    await assert.rejects(
      auth.login(`missing-${index}@example.test`, 'wrong', null),
      /không đúng/,
    )
  }
  const login = await auth.login(ownerInput.email, ownerInput.password, null)
  assert.equal(auth.session(login.token)?.role, 'admin')
})
