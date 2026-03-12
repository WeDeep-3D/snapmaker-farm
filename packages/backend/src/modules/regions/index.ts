import { Elysia } from 'elysia'

import { buildErrorResponse } from '@/utils/common'

import { regionsModel } from './model'
import { Regions, regionsService } from './service'

export const regions = new Elysia({
  prefix: '/api/v1/regions',
  tags: ['Regions'],
})
  .use(regionsModel)
  .use(regionsService)
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
        200: 'getRegionsRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .post(
    '/',
    async ({ body }) => {
      try {
        return await Regions.addRegions(body.regions)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      body: 'addRegionsReqBody',
      response: {
        200: 'addRegionsRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .delete(
    '/:region',
    async ({ params }) => {
      try {
        return await Regions.removeRegion(params.region)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      response: {
        200: 'deleteRegionRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .get(
    '/all',
    async () => {
      try {
        return await Regions.getAllRegions()
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      response: {
        200: 'getAllRegionsRespBody',
        500: 'errorRespBody',
      },
    },
  )
