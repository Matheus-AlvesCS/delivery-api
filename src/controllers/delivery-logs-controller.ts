import type { Request, Response } from "express"

import z from "zod"

import { prisma } from "../database/prisma"

export class DeliveryLogsController {
  async create(request: Request, response: Response) {
    return response.json()
  }
}
