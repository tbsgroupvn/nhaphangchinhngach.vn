import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { join, resolve, basename } from 'node:path'
import { tmpdir } from 'node:os'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioAiProvider } from '../../src/lib/studio/ai-provider'
import { StudioKnowledge } from '../../src/lib/studio/ai-knowledge'
import { StudioGenerations } from '../../src/lib/studio/ai-generation'

async function main() {
  const [mode, directory] = process.argv.slice(2)
  if (
    !['write', 'read'].includes(mode) ||
    resolve(directory, '..') !== resolve(tmpdir()) ||
    !basename(directory).startsWith('tbs-restart-')
  )
    throw new Error('Persistence fixture requires its own temporary directory')
  const db = openStudioDatabase(join(directory, 'studio.sqlite'))
  try {
    const auth = new StudioAuth(db),
      content = new StudioContent(db, auth),
      knowledge = new StudioKnowledge(db, auth)
    const owner = {
        name: 'Restart fixture',
        email: 'restart@example.test',
        password: 'Restart-fixture-password-728!',
      },
      secret = 'restart-bootstrap-token-fixture-32-characters'
    if (mode === 'write') await auth.setupOwner(owner, secret, secret)
    const token = (await auth.login(owner.email, owner.password, null)).token
    content.seedMarketing()
    const provider = new StudioAiProvider(db, auth, {
      encryptionKey: () => Buffer.alloc(32, 7).toString('base64'),
      transport: async () => {
        if (mode !== 'write') throw new Error('Restart must not dispatch AI')
        return {
          value: {
            summary: 'Controlled restart test.',
            notes: [],
            outline: [],
            changes: [
              {
                field: 'title',
                value: 'Persisted AI draft after restart',
                sourceIds: [],
                reason: 'Test only.',
              },
            ],
            links: [],
          },
          usage: { inputTokens: 20, outputTokens: 10, totalTokens: 30 },
        }
      },
    })
    const generations = new StudioGenerations(
      db,
      auth,
      content,
      provider,
      knowledge,
    )
    if (mode === 'write') {
      provider.save(token, 0, {
        provider: 'openai',
        model: 'restart-fixture',
        maxOutputTokens: 2048,
        dailyTokenBudget: 100000,
        dailyRequestLimit: 100,
        apiKey: 'sk-restart-fixture-not-real',
      })
      const doc = content.get(
        content.list().find((item) => item.kind === 'article')!.id,
      )
      const job = await generations.generate(token, {
        id: randomUUID(),
        documentId: doc.id,
        documentVersion: doc.version,
        providerVersion: 1,
        task: 'rewrite',
        fields: ['title'],
        prompt: 'Change only the draft title in this isolated fixture.',
        consent: true,
      })
      generations.apply(token, job.id, {
        version: job.version,
        documentVersion: job.documentVersion,
        fields: ['title'],
        consent: true,
      })
    } else {
      const [record] = generations.list(token),
        job = generations.get(token, record.id),
        doc = content.get(job.documentId)
      assert.equal(job.status, 'completed')
      assert.deepEqual(job.appliedFields, ['title'])
      assert.equal(doc.draft.data.title, 'Persisted AI draft after restart')
      assert.notEqual(doc.published!.data.title, doc.draft.data.title)
      assert.equal(provider.get(token).budget.requests, 1)
      assert.equal(provider.get(token).budget.tokens, 30)
      assert.equal(content.list().length, 26)
      const request = {
        id: job.id,
        documentId: job.documentId,
        documentVersion: job.documentVersion,
        providerVersion: 1,
        task: job.task,
        fields: job.context.fields.map((field) => field.key),
        prompt: job.prompt,
        consent: true,
      }
      generations.remove(token, job.id, job.version)
      await assert.rejects(generations.generate(token, request), {
        code: 'AI_REQUEST_RETIRED',
      })
    }
    console.log(`Persistence ${mode} verified`)
  } finally {
    db.close()
  }
}
void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
