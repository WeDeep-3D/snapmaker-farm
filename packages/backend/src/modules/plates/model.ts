import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { Elysia, t } from 'elysia'

import { plates } from '@/database/schema'
import { buildSuccessRespBody, errorRespBody } from '@/utils/model'

const plateInsertSchema = createInsertSchema(plates)
const plateSelectSchema = createSelectSchema(plates)

const plateCreateSchema = t.Omit(plateInsertSchema, ['id', 'createdAt', 'updatedAt'])
const plateUpdateSchema = t.Omit(plateCreateSchema, [
  'projectId',
  'completedCount',
  'failedCount',
  'totalCount',
  'deviceModel',
  'fileId',
])

export const platesModel = new Elysia({ name: 'plates.model' }).model({
  fullSinglePlateRespBody: buildSuccessRespBody(plateSelectSchema),
  createPlateReqBody: plateCreateSchema,
  updatePlateReqBody: t.Partial(plateUpdateSchema),
  errorRespBody,
})

export type CreatePlateReqBody = typeof platesModel.models.createPlateReqBody.schema.static
export type UpdatePlateReqBody = typeof platesModel.models.updatePlateReqBody.schema.static
