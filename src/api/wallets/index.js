import express from "express";
import { getBalanceController } from "./getBalances.js";
import { sendTRX } from "./sendTRX.js";
import { auth, userOnly } from "../../middlewares/auth.js";
import { validateSendTRX } from "../../middlewares/validation.js";

const router = express.Router();

router.get("/", auth, getBalanceController);
router.get("/balance", auth, getBalanceController);
router.post("/send-trx", auth, validateSendTRX, sendTRX);

export default router;
