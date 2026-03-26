import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { devices } from '@/database/schema'
import type { CreateDeviceReqBody } from '@/modules/devices/model'

export const getAllDevices = async () => {
  return db.select().from(devices)
}

export const getDeviceById = async (id: string) => {
  return (await db.select().from(devices).where(eq(devices.id, id)))[0]
}

export const getDevicesByRegionId = async (regionId: string) => {
  return db.select().from(devices).where(eq(devices.regionId, regionId))
}

export const deleteDevice = async (id: string) => {
  return (await db.delete(devices).where(eq(devices.id, id)).returning())[0]
}

export const upsertDevice = async (data: CreateDeviceReqBody) => {
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
          updatedAt: new Date().toISOString(),
        },
      })
      .returning()
  )[0]
}
