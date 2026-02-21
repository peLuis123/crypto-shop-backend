import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
   
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    color: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  networkFee: {
    type: Number,
    default: -0.01
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'TRC-20'
  },
  transactionHash: {
    type: String,
    default: null
  },
  walletAddress: {
    type: String,
    required: true
  },
  merchantAddress: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const lastOrder = await mongoose.model('Order').findOne().sort({ createdAt: -1 });
    const lastNumber = lastOrder ? parseInt(lastOrder.orderId.replace('#TRX-', '')) : 0;
    this.orderId = `#TRX-${lastNumber + 1}`;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Order', orderSchema);
