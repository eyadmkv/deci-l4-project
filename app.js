const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const mongoSanitize = require('express-mongo-sanitize'); <-------- unused
const helmet = require('helmet');
require('dotenv').config();

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const statsRouter = require('./routes/statsRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(helmet());

// Body parser & Security
app.use(express.json({ limit: '10kb' }));
app.use(cors());
app.set('query parser', 'extended');

// Robust Custom Data Sanitizer
const sanitizeObj = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObj);

  const sanitized = {};
  for (const key in obj) {
    const safeKey = key.replace(/^\$|\./g, '');
    let safeValue = obj[key];
    if (typeof safeValue === 'string') safeValue = safeValue.replace(/\$/g, '');
    else if (typeof safeValue === 'object') safeValue = sanitizeObj(safeValue);
    sanitized[safeKey] = safeValue;
  }
  return sanitized;
};

app.use((req, res, next) => {
  if (req.body) req.body = sanitizeObj(req.body);
  if (req.params) req.params = sanitizeObj(req.params);
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: sanitizeObj(req.query),
      writable: true, configurable: true, enumerable: true
    });
  }
  next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/users', userRouter);

// Catch unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;