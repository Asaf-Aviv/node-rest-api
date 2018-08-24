const router = require('express').Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination(req, filem, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, `${+new Date()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image-png') {
    return cb(null, true);
  }
  cb(null, false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router.get('/', ProductController.getAllProducts);

router.get('/:productId', ProductController.getProductById);

router.post('/', checkAuth, upload.single('productImage'), ProductController.createProduct);

router.patch('/:productId', checkAuth, ProductController.updateProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);

module.exports = router;
