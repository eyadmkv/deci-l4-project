const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    await connectDB();
    // clears old data (if exists) before seeding new data
    console.log('clearing old data...');
    await Category.deleteMany();
    await Product.deleteMany();

    // inserts categories 
    console.log('inserting categories...');
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Phones, Printers, and other tech gadgets.' },
      { name: 'Furniture', description: 'Home decor and office furniture.' },
      { name: 'Accessories', description: 'Daily essentials and clothing items.' }
    ]);

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});


    console.log('inerting products...');
    const products = [
      {
        name: 'Headphones',
        price: 199.99,
        stock: 45,
        description: 'Very good high-quality headphones.',
        category: categoryMap['Electronics']
      },
      {
        name: 'Gaming Keyboard',
        price: 89.99,
        stock: 120,
        description: 'Tactile RGB switches with custom macro keys.',
        category: categoryMap['Electronics']
      },
      {
        name: 'Office Chair',
        price: 249.50,
        stock: 15,
        description: 'High-back mesh design with adjustable lumbar support.',
        category: categoryMap['Furniture']
      },
      {
        name: 'Wooden Desk',
        price: 175.00,
        stock: 8,
        description: 'Students favorite.',
        category: categoryMap['Furniture']
      },
      {
        name: 'Leather Wallet',
        price: 45.00,
        stock: 200,
        description: 'RFID blocking wallet.',
        category: categoryMap['Accessories']
      },
      {
        name: 'Stainless Steel Water Bottle',
        price: 24.99,
        stock: 350,
        description: 'Keeps drinks cold for 24 hours.',
        category: categoryMap['Accessories']
      },
      {
        name: '34 inch Ultra-Wide Curved Monitor',
        price: 449.99,
        stock: 22,
        description: 'Curved productivity monitor with crisp QHD resolution.',
        category: categoryMap['Electronics']
      },
      {
        name: 'Adjustable Desk Lamp',
        price: 34.99,
        stock: 60,
        description: 'LED Desk lamp with adjustable brightness.',
        category: categoryMap['Accessories']
      }
    ];

    await Product.insertMany(products);

    console.log(`Successfully seeded ${categories.length} categories.`);
    console.log(`Successfully seeded ${products.length} products.`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();