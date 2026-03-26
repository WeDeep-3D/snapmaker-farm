import { Elysia } from 'elysia'

import { buildErrorResponse } from '@/utils/common'

import { farmsModel } from './model'
import { Farms } from './service'

export const farms = new Elysia({
  prefix: '/api/v1/farms',
  tags: ['Farms'],
})
  .use(farmsModel)
  .get(
    '/',
    async () => {
      try {
        return await Farms.getFarm()
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      response: {
        200: 'fullSingleFarmRespBody',
        500: 'errorRespBody',
      },
    },
  )
