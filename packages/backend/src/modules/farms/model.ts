import { createSelectSchema } from 'drizzle-typebox'
import { Elysia } from 'elysia'

import { farms } from '@/database/schema'
import { buildSuccessRespBody, errorRespBody } from '@/utils/model'

const farmSelectSchema = createSelectSchema(farms)

export const farmsModel = new Elysia({ name: 'farms.model' }).model({
  fullSingleFarmRespBody: buildSuccessRespBody(farmSelectSchema),
  emptyRespBody: buildSuccessRespBody(),
  errorRespBody,
})
