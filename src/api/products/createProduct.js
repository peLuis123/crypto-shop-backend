import Product from '../../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }

    const product = new Product({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      image: image || null,
      createdBy: req.user.id
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
