import { Elysia } from 'elysia'

import { buildErrorResponse } from '@/utils/common'

import { regionsModel } from './model'
import { Regions } from './service'

export const regions = new Elysia({
  prefix: '/api/v1/regions',
  tags: ['Regions'],
})
  .use(regionsModel)
  .get(
    '/',
    async () => {
      try {
        return await Regions.getRegions()
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      response: {
        200: 'fullMultipleRegionsRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      try {
        return await Regions.getRegion(params.id)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      response: {
        200: 'fullSingleRegionRespBody',
        404: 'errorRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .post(
    '/',
    async ({ body }) => {
      try {
        return await Regions.createRegion(body)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      body: 'createRegionReqBody',
      response: {
        200: 'fullSingleRegionRespBody',
        409: 'errorRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      try {
        return await Regions.updateRegion(params.id, body)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      body: 'updateRegionReqBody',
      response: {
        200: 'fullSingleRegionRespBody',
        404: 'errorRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .delete(
    '/:id',
    async ({ params }) => {
      try {
        return await Regions.deleteRegion(params.id)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      response: {
        200: 'emptyRespBody',
        500: 'errorRespBody',
      },
    },
  )
