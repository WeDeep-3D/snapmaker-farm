import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { Elysia, t } from 'elysia'

import { regions } from '@/database/schema'
import { buildSuccessRespBody, errorRespBody } from '@/utils/model'

const regionSelectSchema = createSelectSchema(regions)
const regionInsertSchema = createInsertSchema(regions)

const regionCreateSchema = t.Omit(regionInsertSchema, ['id', 'createdAt'])
const regionUpdateSchema = t.Partial(regionCreateSchema)

export const regionsModel = new Elysia({ name: 'regions.model' }).model({
  fullSingleRegionRespBody: buildSuccessRespBody(regionSelectSchema),
  fullMultipleRegionsRespBody: buildSuccessRespBody(t.Array(regionSelectSchema)),
  createRegionReqBody: regionCreateSchema,
  updateRegionReqBody: regionUpdateSchema,
  emptyRespBody: buildSuccessRespBody(),
  errorRespBody,
})

export type CreateRegionReqBody = typeof regionsModel.models.createRegionReqBody.schema.static
export type UpdateRegionReqBody = typeof regionsModel.models.updateRegionReqBody.schema.static
