const Product = require('../models/Product');

exports.getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          numProducts: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
        }
      },
      {
        $lookup: {
          from: 'categories', // this MUST match the name of the collection in the mongoDB DB
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' }
    ]);

    res.status(200).json({ status: 'success', data: { stats } });
  } catch (error) {
    next(error);
  }
};