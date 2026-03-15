import { Elysia } from 'elysia'

import { log } from '@/log'
import { buildErrorResponse, buildSuccessResponse } from '@/utils/common'

import type { CreatePlateReqBody, UpdatePlateReqBody } from './model'
import { deletePlateById, insertPlate, selectPlateById, updatePlateById } from './repository'

export abstract class Plates {
  static async createPlate(data: CreatePlateReqBody) {
    try {
      const insertedPlate = await insertPlate(data)
      if (!insertedPlate) {
        return buildErrorResponse(500, 'Failed to create plate')
      }
      return buildSuccessResponse(insertedPlate)
    } catch (error) {
      log.error(error, 'Database error while creating plate')
      throw error
    }
  }
  static async getPlate(plateId: string) {
    try {
      const selectedPlate = await selectPlateById(plateId)
      if (!selectedPlate) {
        return buildErrorResponse(404, 'Plate not found')
      }
      return buildSuccessResponse(selectedPlate)
    } catch (error) {
      log.error(error, 'Database error while fetching plate')
      throw error
    }
  }
  static async updatePlate(plateId: string, data: UpdatePlateReqBody) {
    try {
      const updatedPlate = await updatePlateById(plateId, data)
      if (!updatedPlate) {
        return buildErrorResponse(404, 'Plate not found')
      }
      return buildSuccessResponse(updatedPlate)
    } catch (error) {
      log.error(error, 'Database error while updating plate')
      throw error
    }
  }
  static async deletePlate(plateId: string) {
    try {
      const deletedPlate = await deletePlateById(plateId)
      if (!deletedPlate) {
        return buildErrorResponse(404, 'Plate not found')
      }
      return buildSuccessResponse(deletedPlate)
    } catch (error) {
      log.error(error, 'Database error while deleting plate')
      throw error
    }
  }
}

export const platesService = new Elysia({ name: 'plates.service' })
