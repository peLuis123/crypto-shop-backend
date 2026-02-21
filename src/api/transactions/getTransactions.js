import Transaction from '../../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, status, limit = 10, page = 1 } = req.query;

    let query = { userId };
    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
