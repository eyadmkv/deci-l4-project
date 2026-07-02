const express = require('express');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../controllers/authController'); 

const router = express.Router();

router
  .route('/')
  .get(productController.getProducts)
  .post(protect, productController.createProduct); 

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(protect, productController.updateProduct)
  .delete(protect, restrictTo('admin'), productController.deleteProduct); 

module.exports = router;