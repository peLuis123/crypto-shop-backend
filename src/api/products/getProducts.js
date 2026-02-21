import Product from '../../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('-createdBy')
      .sort({ createdAt: -1 });

    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
