import User from "../../models/User.js";
import speakeasy from "speakeasy";

export const verify2FA = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: '2FA code is required' 
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ 
        success: false, 
        error: '2FA is not initialized' 
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid 2FA code' 
      });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({
      success: true,
      message: '2FA enabled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
