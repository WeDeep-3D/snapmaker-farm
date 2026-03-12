import { and, eq } from 'drizzle-orm'
import { Elysia } from 'elysia'

import { db } from '@/database'
import { backendRegions } from '@/database/schema'
import { log } from '@/log'
import { buildSuccessResponse } from '@/utils/common'
import { ensureBackendId } from '@/modules/regions/utils'

export const backendId = ensureBackendId()

// In-memory cache for fast access to current backend's accessible regions
let cachedRegions: Set<string> = new Set()

async function loadRegionsFromDb(): Promise<Set<string>> {
  const rows = await db
    .select({ region: backendRegions.region })
    .from(backendRegions)
    .where(eq(backendRegions.backendId, backendId))
  return new Set(rows.map((r) => r.region))
}

/**
 * Get the current backend's accessible regions as a Set (from cache).
 * Returns an empty Set if no regions are configured.
 */
export function getAccessibleRegions(): ReadonlySet<string> {
  return cachedRegions
}

export abstract class Regions {
  /**
   * Get accessible regions for the current backend.
   */
  static async getRegions() {
    return buildSuccessResponse({
      backendId,
      regions: [...cachedRegions],
    })
  }

  /**
   * Add regions to the current backend's accessible list.
   * Duplicates are silently ignored (ON CONFLICT DO NOTHING).
   */
  static async addRegions(regionNames: string[]) {
    const values = regionNames.map((region) => ({
      backendId,
      region,
    }))
    await db.insert(backendRegions).values(values).onConflictDoNothing()

    // Refresh cache
    cachedRegions = await loadRegionsFromDb()

    return buildSuccessResponse({
      backendId,
      regions: [...cachedRegions],
    })
  }

  /**
   * Remove a region from the current backend's accessible list.
   */
  static async removeRegion(region: string) {
    await db
      .delete(backendRegions)
      .where(and(eq(backendRegions.backendId, backendId), eq(backendRegions.region, region)))

    // Refresh cache
    cachedRegions = await loadRegionsFromDb()

    return buildSuccessResponse({
      backendId,
      removed: region,
      regions: [...cachedRegions],
    })
  }

  /**
   * Get all regions grouped by backend ID (admin overview).
   */
  static async getAllRegions() {
    const rows = await db.select().from(backendRegions)

    const grouped = new Map<string, string[]>()
    for (const row of rows) {
      const existing = grouped.get(row.backendId)
      if (existing) {
        existing.push(row.region)
      } else {
        grouped.set(row.backendId, [row.region])
      }
    }

    return buildSuccessResponse(
      [...grouped.entries()].map(([bid, regions]) => ({
        backendId: bid,
        regions,
      })),
    )
  }
}

export const regionsService = new Elysia({ name: 'regions.service' }).onStart(async () => {
  cachedRegions = await loadRegionsFromDb()
  log.info(
    { backendId, regions: [...cachedRegions] },
    'Loaded accessible regions for current backend',
  )
})
