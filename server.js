require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-ControlAllow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method === 'OPTION') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, MATCH, DELETE, GET');
    return res.json({});
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');

  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => console.info(`Listening on port ${port}`));
