import User from '../../models/User.js';
import Order from '../../models/Order.js';

const formatTrend = (current, previous) => {
  if (!previous) {
    if (!current) return '0.0%';
    return '+100.0%';
  }
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

export const getCustomers = async (req, res) => {
  try {
    const { search, limit = 10, page = 1 } = req.query;
    const safeLimit = Math.max(1, parseInt(limit));
    const safePage = Math.max(1, parseInt(page));
    const skip = (safePage - 1) * safeLimit;

    const match = { role: 'user' };
    if (search) {
      match.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [result] = await User.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: safeLimit },
            {
              $lookup: {
                from: 'orders',
                let: { userId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
                  { $match: { status: { $in: ['completed', 'refunded'] } } },
                  {
                    $group: {
                      _id: null,
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
                ],
                as: 'orderStats'
              }
            },
            {
              $addFields: {
                completedTotal: { $ifNull: [{ $arrayElemAt: ['$orderStats.completedTotal', 0] }, 0] },
                refundedTotal: { $ifNull: [{ $arrayElemAt: ['$orderStats.refundedTotal', 0] }, 0] }
              }
            },
            {
              $addFields: {
                totalSpent: { $subtract: ['$completedTotal', '$refundedTotal'] }
              }
            },
            {
              $project: {
                password: 0,
                'wallet.privateKey': 0,
                orderStats: 0,
                completedTotal: 0,
                refundedTotal: 0
              }
            }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    const users = result?.data || [];
    const total = result?.totalCount?.[0]?.count || 0;

    const now = new Date();
    const start30 = new Date(now);
    start30.setDate(now.getDate() - 30);
    const start60 = new Date(now);
    start60.setDate(now.getDate() - 60);

    const currentUsers = await User.countDocuments({ role: 'user', createdAt: { $gte: start30 } });
    const previousUsers = await User.countDocuments({ role: 'user', createdAt: { $gte: start60, $lt: start30 } });

    const [currentVolume] = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'refunded'] }, createdAt: { $gte: start30 } } },
      {
        $group: {
          _id: null,
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

    const [previousVolume] = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'refunded'] }, createdAt: { $gte: start60, $lt: start30 } } },
      {
        $group: {
          _id: null,
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

    const currentVolumeTotal = (currentVolume?.completedTotal || 0) - (currentVolume?.refundedTotal || 0);
    const previousVolumeTotal = (previousVolume?.completedTotal || 0) - (previousVolume?.refundedTotal || 0);

    const [allTimeVolume] = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'refunded'] } } },
      {
        $group: {
          _id: null,
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

    const allTimeVolumeTotal = (allTimeVolume?.completedTotal || 0) - (allTimeVolume?.refundedTotal || 0);

    const totalUsers = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      users,
      stats: {
        total: totalUsers,
        totalVolume: allTimeVolumeTotal,
        totalChange: formatTrend(currentUsers, previousUsers),
        volumeChange: formatTrend(currentVolumeTotal, previousVolumeTotal)
      },
      pagination: {
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit),
        limit: safeLimit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
