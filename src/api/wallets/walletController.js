import { sendTRX } from "../../services/tron.service.js";
import User from "../../models/User.js";

export const sendTRXController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { toAddress, amount } = req.body;

    // Validar entrada
    if (!toAddress || !amount) {
      return res.status(400).json({ error: "toAddress and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Obtener usuario con wallet
    const user = await User.findById(userId);
    if (!user || !user.wallet.privateKey) {
      return res.status(404).json({ error: "User or wallet not found" });
    }

    // Enviar TRX
    const tx = await sendTRX(user.wallet.privateKey, toAddress, amount);

    res.json({
      message: "TRX sent successfully",
      transaction: tx
    });
  } catch (error) {
    console.error('Send TRX error:', error);
    res.status(500).json({ error: error.message });
  }
};
