import { Elysia } from 'elysia'

import { log } from '@/log'
import { buildErrorResponse, buildSuccessResponse } from '@/utils/common'

import type { CreateProjectReqBody, UpdateProjectReqBody } from './model'
import {
  deleteProjectById,
  insertProject,
  selectAllProjects,
  selectProjectById,
  updateProjectById,
} from './repository'

export abstract class Project {
  static async createProject(data: CreateProjectReqBody) {
    try {
      const insertedProject = await insertProject(data)
      if (!insertedProject) {
        return buildErrorResponse(500, 'Failed to create project')
      }
      return buildSuccessResponse(insertedProject)
    } catch (error) {
      log.error(error, 'Database error while creating project')
      throw error
    }
  }
  static async getAllProjects() {
    try {
      return buildSuccessResponse(await selectAllProjects())
    } catch (error) {
      log.error(error, 'Database error while fetching all projects')
      throw error
    }
  }
  static async getProject(projectId: string) {
    try {
      const selectedProject = await selectProjectById(projectId)
      if (!selectedProject) {
        return buildErrorResponse(404, 'Project not found')
      }
      return buildSuccessResponse(selectedProject)
    } catch (error) {
      log.error(error, 'Database error while fetching project')
      throw error
    }
  }
  static async updateProject(projectId: string, data: UpdateProjectReqBody) {
    try {
      const updatedProject = await updateProjectById(projectId, data)
      if (!updatedProject) {
        return buildErrorResponse(404, 'Project not found')
      }
      return buildSuccessResponse(updatedProject)
    } catch (error) {
      log.error(error, 'Database error while updating project')
      throw error
    }
  }
  static async deleteProject(projectId: string) {
    try {
      const deletedProject = await deleteProjectById(projectId)
      if (!deletedProject) {
        return buildErrorResponse(404, 'Project not found')
      }
      return buildSuccessResponse(deletedProject)
    } catch (error) {
      log.error(error, 'Database error while deleting project')
      throw error
    }
  }
}

export const projectsService = new Elysia({ name: 'projects.service' })
