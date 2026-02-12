import { getBalance } from "../../services/tron.service.js";
import User from "../../models/User.js";

export const getBalanceController = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener usuario con wallet
    const user = await User.findById(userId);
    if (!user || !user.wallet.address) {
      return res.status(404).json({ error: "User or wallet not found" });
    }

    const address = user.wallet.address;
    const trxBalance = await getBalance(address);

    res.json({
      address,
      TRX: trxBalance
    });

  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: error.message });
  }
};
