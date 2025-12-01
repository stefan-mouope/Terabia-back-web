const { User, Product, Order, sequelize } = require('../models'); // Import Product and Order models, and sequelize instance

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const [updatedRows] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedRows = await User.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSellerStats = async (req, res) => {
    console.log('NOUVELLE FONCTION GETSELLERSTATS APPELEE - VERSION SQLITE 2025');
  try {
    const sellerId = req.params.id;

    // 1. Total produits et actifs → OK avec SQLite
    const totalProducts = await Product.count({
      where: { seller_id: sellerId },
    });

    const activeProducts = await Product.count({
      where: { seller_id: sellerId, is_active: true },
    });

    // 2. Commandes + CA → version 100% SQLite (pas de json_each !)
    const orders = await Order.findAll({
      attributes: ['items'],
      raw: true,
    });

    let totalOrders = 0;
    let totalRevenue = 0;

    for (const order of orders) {
      if (!order.items) continue;

      let items;
      try {
        items = typeof order.items === 'string' 
          ? JSON.parse(order.items) 
          : order.items;
      } catch (e) {
        continue;
      }

      let hasSellerProduct = false;

      for (const item of items) {
        const productId = item.productId || item.id;
        if (!productId) continue;

        const product = await Product.findByPk(productId);
        if (product && product.seller_id === sellerId) {
          hasSellerProduct = true;
          const price = parseFloat(item.price || 0);
          const qty = parseInt(item.quantity || item.qty || 1, 10);
          totalRevenue += price * qty;
        }
      }

      if (hasSellerProduct) totalOrders += 1;
    }

    res.json({
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
    });

  } catch (error) {
    console.error('Erreur getSellerStats:', error);
    res.status(500).json({ error: error.message });
  }
};