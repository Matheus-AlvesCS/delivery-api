import type { Request, Response, NextFunction } from "express"

import jwt from "jsonwebtoken"

import { authConfig } from "../configs/authConfig"
import { AppError } from "../utils/app-error"

interface ITokenPayload {
  role: string
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError("Token not provided", 401)
    }

    const [, token] = authHeader.split(" ")
    const { secret } = authConfig.jwt

    const { role, sub: id } = jwt.verify(token, secret) as ITokenPayload

    request.user = {
      id,
      role,
    }

    return next()
  } catch (error) {
    throw new AppError("Invalid JWT token", 401)
  }
}
