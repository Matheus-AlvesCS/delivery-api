import { Router } from "express"

import { DeliveriesController } from "../controllers/deliveries-controller"

import { ensureAuthenticated } from "../middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "../middlewares/verify-user-authorization"

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()

deliveriesRoutes.use(ensureAuthenticated)
deliveriesRoutes.post(
  "/",
  verifyUserAuthorization(["seller"]),
  deliveriesController.create,
)

export { deliveriesRoutes }
