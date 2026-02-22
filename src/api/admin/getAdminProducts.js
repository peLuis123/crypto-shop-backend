import Product from '../../models/Product.js';

export const getAdminProducts = async (req, res) => {
  try {
    const { search, category, limit = 10, page = 1 } = req.query;
    const safeLimit = Math.max(1, parseInt(limit));
    const safePage = Math.max(1, parseInt(page));
    const skip = (safePage - 1) * safeLimit;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit),
        limit: safeLimit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
