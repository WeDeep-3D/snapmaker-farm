import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { Elysia, t } from 'elysia'

import { KlippyState } from '@/api/snapmaker/types'
import { devices } from '@/database/schema'
import { buildSuccessRespBody, errorRespBody } from '@/utils/model'

const deviceSelectSchema = createSelectSchema(devices)
const deviceInsertSchema = createInsertSchema(devices)

const deviceCreateSchema = t.Omit(deviceInsertSchema, ['id', 'createdAt', 'updatedAt'])
const deviceRetrieveSchema = t.Composite([
  deviceSelectSchema,
  t.Object({
    printerInfo: t.Object({
      state: t.Enum(KlippyState),
      logFile: t.String(),
      configFile: t.String(),
      softwareVersion: t.String(),
    }),
  }),
])
const deviceUpdateSchema = t.Omit(deviceCreateSchema, ['model', 'serialNumber'])

export const devicesModel = new Elysia({ name: 'devices.model' }).model({
  fullSingleDeviceRespBody: buildSuccessRespBody(deviceRetrieveSchema),
  fullMultipleDevicesRespBody: buildSuccessRespBody(t.Array(deviceRetrieveSchema)),
  emptyRespBody: buildSuccessRespBody(),
  createDeviceReqBody: deviceCreateSchema,
  createDeviceReqQuery: t.Object({
    force: t.Optional(
      t.Boolean({
        description:
          'Whether to force bind the device even if it is already bound to a region. Default is false.',
      }),
    ),
  }),
  retrieveDeviceReqQuery: t.Object({
    regionId: t.Optional(
      t.String({
        format: 'uuid',
        description: 'Filter devices by region ID. If not specified, returns all devices.',
      }),
    ),
  }),
  updateDeviceReqBody: t.Partial(deviceUpdateSchema),
  deleteDeviceReqQuery: t.Object({
    id: t.String({ format: 'uuid', description: 'Device ID to unbind and delete' }),
  }),
  downloadDeviceLogsReqQuery: t.Object({
    id: t.String({ format: 'uuid', description: 'Device ID to download logs for' }),
  }),
  downloadDeviceLogsRespBody: t.String({ description: 'Device logs in plain text format' }),
  errorRespBody,
})

export type CreateDeviceReqBody = typeof devicesModel.models.createDeviceReqBody.schema.static
export type UpdateDeviceReqBody = typeof devicesModel.models.updateDeviceReqBody.schema.static
