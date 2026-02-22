import Order from '../../models/Order.js';

export const getSales = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const sales = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username email');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      sales: sales.map((sale) => ({
        ...sale.toObject(),
        txHash: sale.transactionHash
      })),
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
