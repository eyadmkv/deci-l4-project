const Product = require('../models/Product');
const AppError = require('../utils/AppError');

// get all products
exports.getProducts = async (req, res, next) => {
  try {
    // this is for debugging, please don't judge 
    console.log('1. Raw req.query:', req.query); 

    // filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // filtering for advanced queries (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    console.log('2. Parsed query for MongoDB:', JSON.parse(queryStr));

    
    let query = Product.find(JSON.parse(queryStr)).populate({
      path: 'category',
      select: 'name description'
    });

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default: newest first
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // execute query
    const products = await query;
    const totalProducts = await Product.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalResults: totalProducts
      },
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

// get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// create product
exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    
    const populatedProduct = await newProduct.populate('category');

    res.status(201).json({
      status: 'success',
      data: { product: populatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

// update product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category');

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};