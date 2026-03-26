import { db } from '@/database'
import { farms } from '@/database/schema'

export const getOrCreateFarm = async () => {
  const existing = await db.select().from(farms).limit(1)
  if (existing[0]) {
    return existing[0]
  }

  const inserted = (await db.insert(farms).values({}).returning())[0]
  if (!inserted) {
    throw new Error('Failed to initialize farm record')
  }
  return inserted
}
