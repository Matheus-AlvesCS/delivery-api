import type { Request, Response } from "express"

export class DeliveriesController {
  async create(request: Request, response: Response) {
    return response.json()
  }
}
