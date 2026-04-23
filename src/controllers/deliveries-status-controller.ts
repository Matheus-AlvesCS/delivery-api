import type { Request, Response } from "express"

import z from "zod"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/app-error"

export class DeliveriesStatusController {
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      status: z.enum(["processing", "shipped", "delivered"]),
    })

    const { id } = paramsSchema.parse(request.params)
    const { status } = bodySchema.parse(request.body)

    const delivery = await prisma.delivery.findUnique({ where: { id } })

    if (!delivery) {
      throw new AppError("Delivery not found", 404)
    }

    await prisma.delivery.update({ where: { id }, data: { status } })

    return response.json()
  }
}
