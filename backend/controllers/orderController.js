const { Order } = require('../models');
// 1. IMPORT NÉCESSAIRE DU CONTRÔLEUR DE LIVRAISON ET DE L'INSTANCE SEQUELIZE
const deliveryController = require('./deliveryController'); 
const sequelize = Order.sequelize; 


exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const newOrder = await Order.create(req.body, { transaction });

    await deliveryController.createDeliveryFromOrder(newOrder, transaction); 

    await transaction.commit();
    
    res.status(201).json(newOrder);

  } catch (error) {
    if (transaction) await transaction.rollback();
    
    console.error("Erreur critique lors de la création de la commande et de la livraison :", error);

    res.status(500).json({ 
      error: "La commande n'a pas pu être créée (Rollback effectué).",
      details: error.message
    });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const [updatedRows] = await Order.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const updatedOrder = await Order.findByPk(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedRows = await Order.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByBuyerId = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { buyer_id: req.params.buyer_id },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
