const router = require('express').Router();
const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.delete('/:userId', checkAuth, UserController.deleteUser);

module.exports = router;
