 
import { createWallet } from "../../services/tron.service.js";
 
export const createWalletController = async (req, res) => {
  try {
    const wallet = await createWallet();
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

 