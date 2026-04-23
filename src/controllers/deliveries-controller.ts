import type { Request, Response } from "express"

import z from "zod"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/app-error"
export class DeliveriesController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.uuid(),
      description: z.string().nonempty(),
    })

    const { user_id, description } = bodySchema.parse(request.body)

    const existingUser = await prisma.user.findUnique({
      where: { id: user_id },
    })

    if (!existingUser) {
      throw new AppError("User not found", 404)
    }

    await prisma.delivery.create({
      data: {
        user_id,
        description,
      },
    })

    return response.json({ message: "Ok" })
  }
}
