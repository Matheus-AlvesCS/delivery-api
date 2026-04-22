import type { Request, Response } from "express"

import z, { email } from "zod"
import { compare } from "bcrypt"
import jwt from "jsonwebtoken"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/app-error"
import { authConfig } from "../configs/authConfig"

export class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new AppError("Invalid email or password", 401)
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = jwt.sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn,
    })

    const { password: _, ...userWithoutPassword } = user

    return response.json({ token, user: userWithoutPassword })
  }
}
