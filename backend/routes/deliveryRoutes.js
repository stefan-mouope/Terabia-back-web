const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.post('/', deliveryController.createDelivery);
router.get('/:id', deliveryController.getDeliveryById);
router.put('/:id', deliveryController.updateDelivery);
router.delete('/:id', deliveryController.deleteDelivery);
router.get('/', deliveryController.getAllDeliveries);
router.get('/order/:order_id', deliveryController.getDeliveryByOrderId);

module.exports = router;
