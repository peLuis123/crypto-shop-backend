import Order from '../../models/Order.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionHash } = req.body;

    if (!['pending', 'completed', 'refunded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (transactionHash) {
      order.transactionHash = transactionHash;
    }
    order.updatedAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
