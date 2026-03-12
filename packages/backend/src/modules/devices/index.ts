import { Elysia, t } from 'elysia'

import { buildErrorResponse } from '@/utils/common'
import { getAccessibleRegions } from '@/modules/regions/service'

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
    ({ store, query }) => {
      const filterByRegion = query.filterByRegion !== 'false'
      const accessibleRegions = getAccessibleRegions()
      const shouldFilter = filterByRegion && accessibleRegions.size > 0

      const filterMap = <V>(map: Map<string, V>, getRegion: (v: V) => string | null) => {
        if (!shouldFilter) return map
        const filtered = new Map<string, V>()
        for (const [key, value] of map) {
          const region = getRegion(value)
          if (region === null || accessibleRegions.has(region)) {
            filtered.set(key, value)
          }
        }
        return filtered
      }

      return {
        devices: {
          connected: filterMap(store.connectedDevices, (d) => d.dbRecord.region),
          disconnected: filterMap(store.disconnectedDevices, (d) => d.region),
          unknown: filterMap(store.unknownDevices, (d) => d.dbRecord.region),
        },
      }
    },
    {
      query: t.Object({
        filterByRegion: t.Optional(
          t.String({
            description:
              'Filter devices by accessible regions (default: "true"). Set to "false" to return all devices.',
          }),
        ),
      }),
    },
  )
  .post(
    '/',
    async ({ body, store }) => {
      try {
        return await Devices.bindDevices(body, store)
      } catch (error) {
        return buildErrorResponse(500, (error as Error).message)
      }
    },
    {
      body: 'bindDevicesReqBody',
      response: {
        200: 'bindDevicesRespBody',
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
