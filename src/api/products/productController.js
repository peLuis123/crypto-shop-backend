import Product from '../../models/Product.js';

// 📋 Obtener todos los productos (público)
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

// 🔍 Obtener un producto por ID (público)
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

// ➕ Crear producto (SOLO ADMIN)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    // Validar
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
      createdBy: req.user.id // El admin que lo crea
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

// ✏️ Actualizar producto (SOLO ADMIN)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image, isActive } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Actualizar campos
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;
    if (image !== undefined) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;
    product.updatedAt = Date.now();

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Eliminar producto (SOLO ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
