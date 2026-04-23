import type { Request, Response, NextFunction } from "express"

import { AppError } from "../utils/app-error"

export function verifyUserAuthorization(authorizatedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = request.user

    if (!user) {
      throw new AppError("Unauthorized", 401)
    }

    if (!authorizatedRoles.includes(user.role)) {
      throw new AppError("Unauthorized", 401)
    }

    return next()
  }
}
