import User from '../../models/User.js';
import { generateTokens } from '../../utils/tokenUtils.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'User account is inactive' });
    }

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        wallet: user.wallet.address
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
