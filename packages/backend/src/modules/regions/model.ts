import { Elysia, t } from 'elysia'

import { buildSuccessRespBody, errorRespBody } from '@/utils/model'

export const regionsModel = new Elysia({ name: 'regions.model' }).model({
  getRegionsRespBody: buildSuccessRespBody(
    t.Object({
      backendId: t.String(),
      regions: t.Array(t.String()),
    }),
  ),
  addRegionsReqBody: t.Object({
    regions: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
  }),
  addRegionsRespBody: buildSuccessRespBody(
    t.Object({
      backendId: t.String(),
      regions: t.Array(t.String()),
    }),
  ),
  deleteRegionRespBody: buildSuccessRespBody(
    t.Object({
      backendId: t.String(),
      removed: t.String(),
      regions: t.Array(t.String()),
    }),
  ),
  getAllRegionsRespBody: buildSuccessRespBody(
    t.Array(
      t.Object({
        backendId: t.String(),
        regions: t.Array(t.String()),
      }),
    ),
  ),
  errorRespBody,
})
