import request from "supertest"

import { prisma } from "../database/prisma"
import { app } from "../app"

describe("UsersController", () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } })
  })

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "testpassword",
    })

    user_id = response.body.id

    expect(response.status).toBe(201)
    expect(response.body.email).toBe("testuser@example.com")
  })

  it("should throw an error if email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "testpassword",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("This email is already in use")
  })

  it("should throw an error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "invalid-email",
      password: "testpassword",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Validation error")
  })
})
