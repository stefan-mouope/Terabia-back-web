const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.get('/', orderController.getAllOrders);
router.get('/buyer/:buyer_id', orderController.getOrdersByBuyerId);

module.exports = router;
