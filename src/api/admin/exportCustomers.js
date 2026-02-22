import User from '../../models/User.js';
import Order from '../../models/Order.js';

export const exportCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('username email wallet.address createdAt isActive lastLogin')
      .sort({ createdAt: -1 });

    const userIds = users.map((user) => user._id);

    const orderTotals = await Order.aggregate([
      { $match: { userId: { $in: userIds }, status: { $in: ['completed', 'refunded'] } } },
      {
        $group: {
          _id: '$userId',
          completedTotal: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$total', 0]
            }
          },
          refundedTotal: {
            $sum: {
              $cond: [{ $eq: ['$status', 'refunded'] }, '$total', 0]
            }
          }
        }
      }
    ]);

    const totalsByUser = new Map();
    for (const row of orderTotals) {
      totalsByUser.set(String(row._id), (row.completedTotal || 0) - (row.refundedTotal || 0));
    }

    const header = [
      'id',
      'username',
      'email',
      'walletAddress',
      'totalSpent',
      'isActive',
      'createdAt',
      'lastLogin'
    ];

    const lines = [header.join(',')];

    for (const user of users) {
      const totalSpent = totalsByUser.get(String(user._id)) || 0;
      const row = [
        user._id,
        user.username,
        user.email,
        user.wallet?.address || '',
        totalSpent.toFixed(2),
        user.isActive,
        user.createdAt?.toISOString() || '',
        user.lastLogin?.toISOString() || ''
      ];
      lines.push(row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','));
    }

    const csv = lines.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
