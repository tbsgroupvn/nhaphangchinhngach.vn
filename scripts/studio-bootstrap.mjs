import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, join, sep } from 'node:path'

const directory = resolve(process.env.STUDIO_DATA_DIR || '.data')
const publicDirectory = resolve('public')
if (directory === publicDirectory || directory.startsWith(`${publicDirectory}${sep}`)) throw new Error('Studio secrets must not be stored in public')
mkdirSync(directory, { recursive: true, mode: 0o700 })
const file = join(directory, 'installation.json')
if (existsSync(file)) {
  console.log(`Existing installation preserved: ${file}`)
} else {
  writeFileSync(file, JSON.stringify({ bootstrapToken: randomBytes(32).toString('base64url'), encryptionKey: randomBytes(32).toString('base64') }, null, 2), { flag: 'wx', mode: 0o600 })
  console.log(`Private installation keys created: ${file}`)
}
console.log('Use the bootstrapToken in the owner setup screen. Do not commit or share this file.')
