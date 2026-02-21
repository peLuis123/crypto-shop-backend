import User from '../../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        wallet: user.wallet.address,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
