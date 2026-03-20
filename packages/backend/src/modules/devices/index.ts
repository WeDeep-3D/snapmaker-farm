import { Elysia } from 'elysia'

import { buildErrorResponse } from '@/utils/common'

import { devicesModel } from './model'
import { Devices, devicesService } from './service'

export const devices = new Elysia({
  prefix: '/api/v1/devices',
  tags: ['Devices'],
})
  .use(devicesModel)
  .use(devicesService)
  .get(
    '/',
    async ({ query }) => {
      try {
        return await Devices.getDevices(query.regionId)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      query: 'retrieveDeviceReqQuery',
      response: {
        200: 'fullMultipleDevicesRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .post(
    '/',
    async ({ body, query }) => {
      try {
        return await Devices.createDevice(body, query.force)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      body: 'createDeviceReqBody',
      query: 'createDeviceReqQuery',
      response: {
        200: 'emptyRespBody',
        500: 'errorRespBody',
      },
    },
  )
  .get('/:ip/logs', async ({ params }) => {
    try {
      return await Devices.downloadLogs(params.ip)
    } catch (error) {
      return buildErrorResponse(500, (error as Error).message)
    }
  })
