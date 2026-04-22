import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createorder,
  verifypayment,
  verifypaymentwebhook,
} from "../controllers/payment.controller.js";

const router = Router();
router.route("/createorder").post(verifyJWT, createorder);
router.route("/verifypayment").post(verifyJWT, verifypayment);
router.route("/webhook").post(verifypaymentwebhook);
export default router;
