import Order from '../../models/Order.js';
import User from '../../models/User.js';
import { sendTRX } from '../../services/tron.service.js';
import Transaction from '../../models/Transaction.js';

export const payOrder = async (req, res) => {
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

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending' });
    }

    const user = await User.findById(userId);
    if (!user || !user.wallet.privateKey) {
      return res.status(400).json({ error: 'User wallet not found' });
    }

    try {
      const tx = await sendTRX(
        user.wallet.privateKey,
        order.merchantAddress,
        Math.abs(order.total)
      );

      const transaction = new Transaction({
        userId,
        orderId: order._id,
        type: 'purchase',
        amount: Math.abs(order.total),
        currency: 'TRX',
        network: 'TRC-20',
        transactionHash: tx.txID,
        fromAddress: order.walletAddress,
        toAddress: order.merchantAddress,
        status: 'confirmed'
      });

      await transaction.save();

      order.status = 'completed';
      order.transactionHash = tx.txID;
      order.updatedAt = Date.now();
      await order.save();

      res.json({
        success: true,
        message: 'Payment successful',
        order,
        transaction: {
          hash: tx.txID,
          from: order.walletAddress,
          to: order.merchantAddress,
          amount: Math.abs(order.total)
        }
      });
    } catch (txError) {
      order.status = 'failed';
      await order.save();
      throw txError;
    }
  } catch (error) {
    console.error('Pay order error:', error);
    res.status(500).json({ error: error.message });
  }
};
