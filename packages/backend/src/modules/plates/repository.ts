import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { plates } from '@/database/schema'

import type { CreatePlateReqBody, UpdatePlateReqBody } from './model'

export const insertPlate = async (data: CreatePlateReqBody) => {
  return (await db.insert(plates).values(data).returning())[0]
}

export const selectPlateById = async (plateId: string) => {
  return (await db.select().from(plates).where(eq(plates.id, plateId)).limit(1))[0]
}

export const updatePlateById = async (plateId: string, data: UpdatePlateReqBody) => {
  return (await db.update(plates).set(data).where(eq(plates.id, plateId)).returning())[0]
}

export const deletePlateById = async (plateId: string) => {
  return (await db.delete(plates).where(eq(plates.id, plateId)).returning())[0]
}
