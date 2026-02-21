import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user.id;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Products are required' });
    }

    const user = await User.findById(userId);
    if (!user || !user.wallet.address) {
      return res.status(400).json({ error: 'User wallet not found' });
    }

    let subtotal = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      subtotal += product.price * item.quantity;
      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        color: item.color || null
      });
    }
    const networkFee = -0.01;
    const total = subtotal + networkFee;

    const admin = await User.findOne({ role: 'admin' });
    const merchantAddress = admin?.wallet?.address || process.env.MERCHANT_WALLET_ADDRESS;
    if (!merchantAddress) {
      return res.status(500).json({ error: 'Merchant wallet not configured' });
    }
    const order = new Order({
      userId,
      products: orderProducts,
      subtotal,
      networkFee,
      total,
      walletAddress: user.wallet.address,
      merchantAddress
    });
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id,
        orderId: order._id,
        products: order.products,
        subtotal: order.subtotal,
        networkFee: order.networkFee,
        total: order.total,
        status: order.status,
        merchantAddress: order.merchantAddress,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
};
