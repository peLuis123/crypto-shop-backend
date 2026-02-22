import { verifyRefreshToken, generateTokens } from '../../utils/tokenUtils.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id, decoded.role);

    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    res.cookie('refreshToken', newRefreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
