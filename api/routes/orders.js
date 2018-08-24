const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/orders');

router.get('/', checkAuth, OrderController.getAllOrders);

router.get('/:orderId', checkAuth, OrderController.getOrderById);

router.post('/', checkAuth, OrderController.createOrder);

router.delete('/:orderId', checkAuth, OrderController.deleteOrder);

module.exports = router;
