import Order from '../../models/Order.js';
import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';
import { sendTRX, getBalance } from '../../services/tron.service.js';

export const refundOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'refunded') {
      return res.status(400).json({ error: 'Order already refunded' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Only completed orders can be refunded' });
    }

    const admin = await User.findById(adminId);
    if (!admin || !admin.wallet?.privateKey || !admin.wallet?.address) {
      return res.status(400).json({ error: 'Admin wallet not configured' });
    }

    const amount = Math.abs(order.total);
    const balance = await getBalance(admin.wallet.address);
    if (balance < amount) {
      return res.status(400).json({
        error: 'Insufficient admin balance for refund',
        code: 'INSUFFICIENT_ADMIN_BALANCE',
        adminBalance: balance,
        requiredAmount: amount
      });
    }

    const tx = await sendTRX(admin.wallet.privateKey, order.walletAddress, amount);
    const txHash = tx.txid || tx.txID || tx.transaction?.txID;

    const transaction = new Transaction({
      userId: order.userId,
      orderId: order._id,
      type: 'refund',
      amount,
      currency: 'TRX',
      network: 'TRC-20',
      transactionHash: txHash,
      fromAddress: admin.wallet.address,
      toAddress: order.walletAddress,
      status: 'pending',
      confirmations: 0
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Refund sent. Waiting for blockchain confirmation.',
      orderId: order._id,
      transaction: {
        hash: txHash,
        from: admin.wallet.address,
        to: order.walletAddress,
        amount,
        status: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
