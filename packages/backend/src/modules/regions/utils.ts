import { resolve } from 'node:path'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import { log } from '@/log'

/**
 * Ensure BACKEND_ID is available. If not found in process.env,
 * generate a new UUID, persist it to the .env file, and set it in process.env.
 */
export const ensureBackendId = () => {
  const existing = process.env['BACKEND_ID']
  if (existing) return existing

  const id = crypto.randomUUID()
  const envPath = resolve('.env')

  try {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf-8')
      const separator = content.length > 0 && !content.endsWith('\n') ? '\n' : ''
      writeFileSync(envPath, `${content}${separator}BACKEND_ID=${id}\n`)
    } else {
      writeFileSync(envPath, `BACKEND_ID=${id}\n`)
    }
    log.info({ backendId: id, envPath }, 'Generated new BACKEND_ID and persisted to .env')
  } catch (error) {
    log.warn(
      { backendId: id, envPath, error },
      'Failed to persist BACKEND_ID to .env, using in-memory only',
    )
  }

  process.env['BACKEND_ID'] = id
  return id
}
