import Order from '../../models/Order.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionHash } = req.body;

    if (!['pending', 'completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
        transactionHash: transactionHash || order.transactionHash,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
