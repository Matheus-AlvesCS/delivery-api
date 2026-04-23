import { Router } from "express"

import { DeliveryLogsController } from "../controllers/delivery-logs-controller"

import { ensureAuthenticated } from "../middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "../middlewares/verify-user-authorization"

const deliveryLogsRoutes = Router()
const deliveryLogsController = new DeliveryLogsController()

deliveryLogsRoutes.use(ensureAuthenticated)
deliveryLogsRoutes.post(
  "/",
  verifyUserAuthorization(["seller"]),
  deliveryLogsController.create,
)
deliveryLogsRoutes.get("/:delivery_id/show", deliveryLogsController.show)

export { deliveryLogsRoutes }
