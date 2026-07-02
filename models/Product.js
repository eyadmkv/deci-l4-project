const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'product price is required'],
      min: [0, 'price cannot be negative'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'product description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'product must belong to a category'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);