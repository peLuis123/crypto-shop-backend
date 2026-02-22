import Order from '../../models/Order.js';
import User from '../../models/User.js';

const formatTrend = (current, previous) => {
  if (!previous) {
    if (!current) return '0.0%';
    return '+100.0%';
  }
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

const buildDailySeries = (startDate, days, totalsByDate) => {
  const series = [];
  for (let i = 0; i < days; i += 1) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const dateKey = current.toISOString().slice(0, 10);
    series.push({
      date: dateKey,
      revenue: totalsByDate.get(dateKey) || 0
    });
  }
  return series;
};

export const getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const start30 = new Date(now);
    start30.setDate(now.getDate() - 30);
    const start60 = new Date(now);
    start60.setDate(now.getDate() - 60);

    const start180 = new Date(now);
    start180.setDate(now.getDate() - 180);

    const [allRevenue] = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, networkFees: { $sum: '$networkFee' } } }
    ]);

    const [last30Revenue] = await Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: start30 } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, networkFees: { $sum: '$networkFee' } } }
    ]);

    const [prev30Revenue] = await Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: start60, $lt: start30 } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' }, networkFees: { $sum: '$networkFee' } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalOrdersLast30 = await Order.countDocuments({ createdAt: { $gte: start30 } });
    const totalOrdersPrev30 = await Order.countDocuments({ createdAt: { $gte: start60, $lt: start30 } });

    const statusCountsRaw = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusCounts = statusCountsRaw.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersLast30 = await User.countDocuments({ createdAt: { $gte: start30 } });
    const newUsersPrev30 = await User.countDocuments({ createdAt: { $gte: start60, $lt: start30 } });

    const recentSales = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderId userId total status createdAt transactionHash products')
      .populate('userId', 'username email');

    const topProducts = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$products' },
      { $group: {
        _id: '$products.productId',
        name: { $first: '$products.name' },
        quantitySold: { $sum: '$products.quantity' },
        revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
      } },
      { $sort: { quantitySold: -1 } },
      { $limit: 3 }
    ]);

    const topProductIds = topProducts.map((item) => item._id);

    const topProductsLast30 = await Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: start30 } } },
      { $unwind: '$products' },
      { $match: { 'products.productId': { $in: topProductIds } } },
      { $group: {
        _id: '$products.productId',
        revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
      } }
    ]);

    const topProductsPrev30 = await Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: start60, $lt: start30 } } },
      { $unwind: '$products' },
      { $match: { 'products.productId': { $in: topProductIds } } },
      { $group: {
        _id: '$products.productId',
        revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
      } }
    ]);

    const last30Map = new Map(topProductsLast30.map((item) => [String(item._id), item.revenue]));
    const prev30Map = new Map(topProductsPrev30.map((item) => [String(item._id), item.revenue]));

    const topProductsWithTrend = topProducts.map((product) => {
      const currentRevenue = last30Map.get(String(product._id)) || 0;
      const previousRevenue = prev30Map.get(String(product._id)) || 0;
      return {
        ...product,
        trend: formatTrend(currentRevenue, previousRevenue)
      };
    });

    const chartTotals = await Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: start180 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalsByDate = new Map(chartTotals.map((item) => [item._id, item.revenue]));
    const chartData = buildDailySeries(start180, 181, totalsByDate);

    res.json({
      success: true,
      stats: {
        totals: {
          totalRevenue: allRevenue?.totalRevenue || 0,
          totalOrders,
          activeUsers,
          totalUsers,
          networkFees: allRevenue?.networkFees || 0
        },
        trends: {
          revenueChange: formatTrend(last30Revenue?.totalRevenue || 0, prev30Revenue?.totalRevenue || 0),
          ordersChange: formatTrend(totalOrdersLast30, totalOrdersPrev30),
          usersChange: formatTrend(newUsersLast30, newUsersPrev30),
          feesChange: formatTrend(last30Revenue?.networkFees || 0, prev30Revenue?.networkFees || 0)
        },
        last30Days: {
          totalRevenue: last30Revenue?.totalRevenue || 0,
          totalOrders: totalOrdersLast30,
          networkFees: last30Revenue?.networkFees || 0
        },
        statusCounts
      },
      recentSales,
      topProducts: topProductsWithTrend,
      chartData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
