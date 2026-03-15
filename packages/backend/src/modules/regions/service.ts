import { buildErrorResponse, buildSuccessResponse } from '@/utils/common'

import type { CreateRegionReqBody, UpdateRegionReqBody } from './model'
import {
  createRegion,
  deleteRegion,
  getAllRegions,
  getRegionById,
  updateRegion,
} from './repository'

export abstract class Regions {
  /**
   * Get all regions.
   */
  static async getRegions() {
    return buildSuccessResponse(await getAllRegions())
  }

  /**
   * Get a single region by ID.
   */
  static async getRegion(id: string) {
    const region = await getRegionById(id)
    if (!region) {
      return buildErrorResponse(404, `Region with id '${id}' not found`)
    }
    return buildSuccessResponse(region)
  }

  /**
   * Create a new region.
   * Duplicate names are silently ignored (ON CONFLICT DO NOTHING).
   */
  static async createRegion(body: CreateRegionReqBody) {
    const region = await createRegion(body.name, body.description ?? undefined)
    if (!region) {
      return buildErrorResponse(409, `Region with name '${body.name}' already exists`)
    }
    return buildSuccessResponse(region)
  }

  /**
   * Update an existing region.
   */
  static async updateRegion(id: string, body: UpdateRegionReqBody) {
    const region = await updateRegion(id, body)
    if (!region) {
      return buildErrorResponse(404, `Region with id '${id}' not found`)
    }
    return buildSuccessResponse(region)
  }

  /**
   * Delete a region by ID.
   */
  static async deleteRegion(id: string) {
    await deleteRegion(id)
    return buildSuccessResponse()
  }
}
