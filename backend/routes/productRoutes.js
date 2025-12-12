// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Importe ton middleware d'upload
const upload = require('../middleware/upload');

// Route pour créer un produit → max 10 images
router.post('/', 
  upload.array('images', 10), 
  productController.createProduct
);


// Les autres routes (pas d'upload nécessaire)
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);
router.get('/', productController.getAllProducts);
router.get('/seller/:seller_id', productController.getProductsBySellerId);

module.exports = router;