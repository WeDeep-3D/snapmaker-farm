import { eq } from 'drizzle-orm'

import { db } from '@/database'
import { projects } from '@/database/schema'

import type { CreateProjectReqBody, UpdateProjectReqBody } from './model'

export const insertProject = async (data: CreateProjectReqBody) => {
  return (await db.insert(projects).values(data).returning())[0]
}

export const selectAllProjects = async () => {
  return db.select().from(projects)
}

export const selectProjectById = async (projectId: string) => {
  return (await db.select().from(projects).where(eq(projects.id, projectId)).limit(1))[0]
}

export const updateProjectById = async (projectId: string, data: UpdateProjectReqBody) => {
  return (await db.update(projects).set(data).where(eq(projects.id, projectId)).returning())[0]
}

export const deleteProjectById = async (projectId: string) => {
  return (await db.delete(projects).where(eq(projects.id, projectId)).returning())[0]
}
