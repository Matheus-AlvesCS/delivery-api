import { Router } from "express"

import { DeliveriesController } from "../controllers/deliveries-controller"

import { ensureAuthenticated } from "../middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "../middlewares/verify-user-authorization"

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()

deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(["seller"]))
deliveriesRoutes.post("/", deliveriesController.create)
deliveriesRoutes.get("/", deliveriesController.index)

export { deliveriesRoutes }
