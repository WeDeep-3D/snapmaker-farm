import { eq, sql } from 'drizzle-orm'

import { db } from '@/database'
import { devices, farmMetadata } from '@/database/schema'

export const getAllDevices = async () => {
  return db.select().from(devices)
}

export const getDevicesByRegionId = async (regionId: string) => {
  return db.select().from(devices).where(eq(devices.regionId, regionId))
}

export const upsertDevice = async (data: {
  model: typeof devices.$inferInsert.model
  serialNumber: string
  description?: string
  ethIp?: string | null | undefined
  ethMac?: string | null | undefined
  wlanIp?: string | null | undefined
  wlanMac?: string | null | undefined
  regionId?: string | null | undefined
}) => {
  return (
    await db
      .insert(devices)
      .values(data)
      .onConflictDoUpdate({
        target: [devices.model, devices.serialNumber],
        set: {
          description: data.description,
          ethIp: data.ethIp,
          ethMac: data.ethMac,
          wlanIp: data.wlanIp,
          wlanMac: data.wlanMac,
          ...(data.regionId !== undefined ? { regionId: data.regionId } : {}),
          updatedAt: sql`now()`,
        },
      })
      .returning()
  )[0]
}

export const getOrCreateFarmMetadata = async () => {
  const existing = await db.select().from(farmMetadata).limit(1)
  if (existing[0]) {
    return existing[0].id
  }

  const inserted = (await db.insert(farmMetadata).values({}).returning())[0]
  if (!inserted) {
    throw new Error('Failed to initialize farm metadata')
  }
  return inserted.id
}
