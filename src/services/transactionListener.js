import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import pkg from 'tronweb';
import dotenv from 'dotenv';
import { emitTransactionConfirmed } from '../config/socket.js';

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
            if (order) {
              if (transaction.type === 'purchase' && order.status === 'pending') {
                order.status = 'completed';
                order.updatedAt = Date.now();
                await order.save();

                // Descontar stock de los productos vendidos
                for (const item of order.products) {
                  await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } }
                  );
                }

                emitTransactionConfirmed(
                  transaction.userId.toString(),
                  transaction.orderId.toString(),
                  transaction.transactionHash
                );
              }

              if (transaction.type === 'refund' && order.status !== 'refunded') {
                order.status = 'refunded';
                order.updatedAt = Date.now();
                await order.save();

                // Restaurar stock de los productos refundados
                for (const item of order.products) {
                  await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: item.quantity } }
                  );
                }
              }
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
