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

const bindDeviceResult = t.Object({
  ip: t.String({ format: 'ipv4' }),
  status: t.Union([t.Literal('bound'), t.Literal('already_bound'), t.Literal('error')]),
  device: t.Optional(deviceSelectSchema),
  message: t.Optional(t.String()),
})
export type BindDeviceResult = typeof bindDeviceResult.static

export const devicesModel = new Elysia({ name: 'devices.model' }).model({
  fullSingleDeviceRespBody: buildSuccessRespBody(deviceRetrieveSchema),
  fullMultipleDevicesRespBody: buildSuccessRespBody(t.Array(deviceRetrieveSchema)),
  bindDevicesReqBody: t.Array(
    t.Object({
      ip: t.String({ format: 'ipv4' }),
      force: t.Optional(t.Boolean({ default: false })),
      regionId: t.Optional(t.String({ format: 'uuid' })),
    }),
  ),
  bindDevicesRespBody: buildSuccessRespBody(t.Array(bindDeviceResult)),
  createDeviceReqBody: deviceCreateSchema,
  retrieveDeviceReqQuery: t.Object({
    regionId: t.Optional(
      t.String({
        format: 'uuid',
        description: 'Filter devices by region ID. If not specified, returns all devices.',
      }),
    ),
  }),
  updateDeviceReqBody: t.Partial(deviceUpdateSchema),
  errorRespBody,
})

export type BindDevicesReqBody = typeof devicesModel.models.bindDevicesReqBody.schema.static
export type BindDeviceItem = BindDevicesReqBody[number]
export type CreateDeviceReqBody = typeof devicesModel.models.createDeviceReqBody.schema.static
export type UpdateDeviceReqBody = typeof devicesModel.models.updateDeviceReqBody.schema.static
