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

    const existingDelivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
    })

    if (!existingDelivery) {
      throw new AppError("Delivery not found", 404)
    }

    if (existingDelivery.status === "processing") {
      throw new AppError(
        "Unable to add logs for deliveries with processing status",
      )
    }

    if (existingDelivery.status === "delivered") {
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
}
