import User from '../../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const { role, limit = 10, page = 1 } = req.query;

    const query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password -wallet.privateKey')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);
    const admins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      users,
      stats: {
        total,
        admins,
        activeUsers
      },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
