import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { regions } from '@/database/schema'

export const createRegion = async (name: string, description?: string) => {
  return (
    await db
      .insert(regions)
      .values({ name, description })
      .onConflictDoNothing({ target: regions.name })
      .returning()
  )[0]
}

export const getAllRegions = async () => {
  return db.select().from(regions)
}

export const getRegionById = async (id: string) => {
  return (await db.select().from(regions).where(eq(regions.id, id)))[0]
}

export const updateRegion = async (
  id: string,
  data: { name?: string; description?: string | null },
) => {
  return (await db.update(regions).set(data).where(eq(regions.id, id)).returning())[0]
}

export const deleteRegion = async (id: string) => {
  await db.delete(regions).where(eq(regions.id, id))
}
