
import { sendUSDT } from "../../services/tron.service.js";
export const sendCryptoController = async (req, res) => {
  try {
    const { privateKey, toAddress, amount } = req.body;

    const result = await sendUSDT(privateKey, toAddress, amount);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
