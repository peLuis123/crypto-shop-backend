import User from "../../models/User.js";

export const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }

    if (!walletAddress.startsWith('T') || walletAddress.length !== 34) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid TRON wallet address format' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.wallet.address = walletAddress;

    await user.save();

    res.json({
      success: true,
      message: 'Wallet connected successfully',
      wallet: user.wallet.address
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
