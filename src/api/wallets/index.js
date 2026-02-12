import express from "express";
import { getBalanceController } from "./getBalances.js";
import { sendTRXController } from "./walletController.js";
import { auth, userOnly } from "../../middlewares/auth.js";
import { validateSendTRX } from "../../middlewares/validation.js";

const router = express.Router();

// Solo usuarios autenticados pueden acceder
router.get("/balance", auth, getBalanceController);
router.post("/send-trx", auth, validateSendTRX, sendTRXController);

export default router;
