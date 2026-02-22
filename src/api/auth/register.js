import User from '../../models/User.js';
import { generateTokens } from '../../utils/tokenUtils.js';
import { createWallet } from '../../services/tron.service.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req, res) => {
  try {
    const { email, username, password, passwordConfirm } = req.body;

    if (!email || !username || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const wallet = await createWallet();

    const user = new User({
      email,
      username,
      password,
      wallet: {
        address: wallet.address.base58,
        privateKey: wallet.privateKey
      }
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });

    const balance = await getBalance(user.wallet.address);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        wallet: {
          address: user.wallet.address,
          balance: balance
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};
