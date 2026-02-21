import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import pkg from 'tronweb';
import dotenv from 'dotenv';

dotenv.config();

const { TronWeb } = pkg;

const tronWeb = new TronWeb({
  fullHost: process.env.TRON_NETWORK
});

const CONFIRMATIONS_REQUIRED = 21;
const CHECK_INTERVAL = 15000;

export const getTransactionStatus = async (txHash) => {
  try {
    const tx = await tronWeb.trx.getTransactionInfo(txHash);
    
    if (!tx || !tx.blockNumber) {
      return null;
    }
    
    return {
      confirmed: true,
      confirmations: 21
    };
  } catch (error) {
    return null;
  }
};

export const syncPendingTransactions = async () => {
  try {
    const pendingTransactions = await Transaction.find({
      status: 'pending',
      transactionHash: { $ne: null }
    });

    console.log(`[Listener] Found ${pendingTransactions.length} pending transactions`);

    for (const transaction of pendingTransactions) {
      try {
        const status = await getTransactionStatus(transaction.transactionHash);

        if (status && status.confirmed) {
          console.log(`[Listener] Transaction confirmed: ${transaction.transactionHash}`);
          transaction.status = 'confirmed';
          transaction.confirmations = CONFIRMATIONS_REQUIRED;
          transaction.updatedAt = Date.now();
          await transaction.save();

          if (transaction.orderId) {
            const order = await Order.findById(transaction.orderId);
            if (order && order.status === 'pending') {
              order.status = 'completed';
              order.updatedAt = Date.now();
              await order.save();
            }
          }
        }
      } catch (error) {
      }
    }
  } catch (error) {
  }
};

export const startTransactionListener = () => {
  syncPendingTransactions();
  setInterval(() => {
    syncPendingTransactions();
  }, CHECK_INTERVAL);
};
