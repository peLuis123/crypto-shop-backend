import User from '../../models/User.js';

export const blockCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = typeof isActive === 'boolean' ? isActive : false;
    user.updatedAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? 'User unblocked' : 'User blocked',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
