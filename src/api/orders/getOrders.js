import Order from '../../models/Order.js';

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 10, page = 1 } = req.query;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    const stats = {
      total: await Order.countDocuments({ userId }),
      pending: await Order.countDocuments({ userId, status: 'pending' }),
      completed: await Order.countDocuments({ userId, status: 'completed' }),
      refunded: await Order.countDocuments({ userId, status: 'refunded' }),
      failed: await Order.countDocuments({ userId, status: 'failed' }),
      cancelled: await Order.countDocuments({ userId, status: 'cancelled' })
    };

    res.json({
      success: true,
      orders,
      stats,
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

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
