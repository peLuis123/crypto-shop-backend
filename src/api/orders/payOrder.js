import Order from '../../models/Order.js';
import User from '../../models/User.js';
import { sendTRX, getBalance } from '../../services/tron.service.js';
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

    const balance = await getBalance(user.wallet.address);
    
    if (balance < Math.abs(order.total)) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        code: 'INSUFFICIENT_BALANCE',
        userBalance: balance,
        requiredAmount: Math.abs(order.total)
      });
    }

    try {
      const tx = await sendTRX(
        user.wallet.privateKey,
        order.merchantAddress,
        Math.abs(order.total)
      );

      const txHash = tx.txid || tx.txID || tx.transaction?.txID;

      const transaction = new Transaction({
        userId,
        orderId: order._id,
        type: 'purchase',
        amount: Math.abs(order.total),
        currency: 'TRX',
        network: 'TRC-20',
        transactionHash: txHash,
        fromAddress: order.walletAddress,
        toAddress: order.merchantAddress,
        status: 'pending',
        confirmations: 0
      });

      await transaction.save();
      order.transactionHash = txHash;
      await order.save();

      res.json({
        success: true,
        message: 'Payment sent. Waiting for blockchain confirmation.',
        order,
        transaction: {
          hash: txHash,
          from: order.walletAddress,
          to: order.merchantAddress,
          amount: Math.abs(order.total),
          status: 'pending'
        }
      });
    } catch (txError) {
      order.status = 'failed';
      await order.save();
      throw txError;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
