import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
import { Elysia, t } from 'elysia'

import { projects } from '@/database/schema'
import { buildSuccessRespBody, errorRespBody } from '@/utils/model'

const projectSelectSchema = createSelectSchema(projects)
const projectInsertSchema = createInsertSchema(projects)

const projectCreateSchema = t.Omit(projectInsertSchema, ['id', 'createdAt', 'updatedAt'])
const projectUpdateSchema = t.Omit(projectCreateSchema, [])

export const projectsModel = new Elysia({ name: 'projects.model' }).model({
  fullSingleProjectRespBody: buildSuccessRespBody(projectSelectSchema),
  fullMultipleProjectsRespBody: buildSuccessRespBody(t.Array(projectSelectSchema)),
  createProjectReqBody: projectCreateSchema,
  updateProjectReqBody: t.Partial(projectUpdateSchema),
  errorRespBody,
})

export type CreateProjectReqBody = typeof projectsModel.models.createProjectReqBody.schema.static
export type UpdateProjectReqBody = typeof projectsModel.models.updateProjectReqBody.schema.static
