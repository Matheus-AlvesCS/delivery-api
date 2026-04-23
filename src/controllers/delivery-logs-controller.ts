import type { Request, Response } from "express"

import z from "zod"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/app-error"

export class DeliveryLogsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.uuid(),
      description: z.string().nonempty(),
    })

    const { delivery_id, description } = bodySchema.parse(request.body)

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
    })

    if (!delivery) {
      throw new AppError("Delivery not found", 404)
    }

    if (delivery.status === "processing") {
      throw new AppError(
        "Unable to add logs for deliveries with processing status",
      )
    }

    if (delivery.status === "delivered") {
      throw new AppError("Unable to add logs for deliveries already delivered")
    }

    await prisma.deliveryLog.create({
      data: {
        delivery_id,
        description,
      },
    })

    return response.json()
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      delivery_id: z.uuid(),
    })

    const { delivery_id } = paramsSchema.parse(request.params)

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        logs: {
          omit: {
            delivery_id: true,
            updated_at: true,
          },
        },
      },
    })

    if (!delivery) {
      throw new AppError("Delivery not found", 404)
    }

    if (
      request.user?.role === "customer" &&
      request.user.id !== delivery.user_id
    ) {
      throw new AppError("Not authorized to view this delivery", 401)
    }

    return response.json(delivery)
  }
}
