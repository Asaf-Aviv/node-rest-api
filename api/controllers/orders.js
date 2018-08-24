const Product = require('../models/product');
const Order = require('../models/order');

exports.getAllOrders = (req, res) => {
  Order
    .find()
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      res.json({
        count: docs.length,
        orders: docs.map(doc => ({
          ...doc.toObject({ versionKey: false }),
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`,
          },
        })),
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.getOrderById = (req, res) => {
  const { orderId } = req.params;

  Order
    .findById(orderId)
    .populate('product')
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order Not Found' });
      }
      res.json({
        ...order.toObject({ versionKey: false }),
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.createOrder = (req, res) => {
  const { productId } = req.body;

  Product
    .findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product Not Found',
        });
      }

      const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity,
      });

      order
        .save()
        .then((result) => {
          res.status(201).json({
            message: 'Order Received',
            createdOrder: {
              _id: result.id,
              product: result.product,
              quantity: result.quantity,
            },
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${result._id}`,
            },
          });
        })
        .catch(err => res.status(500).json({ error: err }));
    });
};

exports.deleteOrder = (req, res) => {
  const { orderId } = req.params;

  Order
    .remove({ _id: orderId })
    .exec()
    .then(() => {
      res.json({ message: 'Order Deleted' });
    })
    .catch(err => res.status(500).json({ error: err }));
};
