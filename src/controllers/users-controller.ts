import type { Request, Response } from "express"

import z from "zod"
import { hash } from "bcrypt"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/app-error"

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.email(),
      password: z.string().trim().min(6),
    })

    const { email, name, password } = bodySchema.parse(request.body)

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      throw new AppError("This email is already in use")
    }

    const passwordHash = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json(userWithoutPassword)
  }
}
