import request from "supertest"

import { prisma } from "../database/prisma"
import { app } from "../app"

describe("SessionsController", () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } })
  })

  it("should authenticate and give a valid token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Test User",
      email: "authtestuser@example.com",
      password: "authpassword",
    })

    user_id = userResponse.body.id

    const sessionResponse = await request(app).post("/sessions").send({
      email: "authtestuser@example.com",
      password: "authpassword",
    })

    expect(sessionResponse.status).toBe(200)
    expect(sessionResponse.body.token).toEqual(expect.any(String))
  })
})
