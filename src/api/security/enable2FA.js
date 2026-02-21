import User from "../../models/User.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export const enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ 
        success: false, 
        error: '2FA is already enabled' 
      });
    }

    const secret = speakeasy.generateSecret({
      name: `CryptoShop (${user.email})`,
      issuer: 'CryptoShop',
      length: 32
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      success: true,
      message: '2FA setup initiated',
      qrCode,
      secret: secret.base32
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
