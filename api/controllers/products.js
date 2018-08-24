const Product = require('../models/product');

exports.getAllProducts = (req, res) => {
  Product
    .find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          ...doc.toObject(({ versionKey: false })),
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`,
          },
        })),
      };

      res.json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getProductById = (req, res) => {
  const { productId } = req.params;

  Product
    .findById(productId)
    .exec()
    .then((doc) => {
      if (doc) {
        return res.json(doc);
      }

      res.status(404).json({
        message: 'Product Not Found',
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.createProduct = (req, res) => {
  const product = new Product({
    ...JSON.parse(req.body.product),
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Product Created',
        success: true,
        createdProduct: {
          ...result.toObject({ versionKey: false }),
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.updateProduct = (req, res) => {
  const { productId } = req.params;
  const updateOps = {};

  req.body
    .forEach((ops) => {
      updateOps[ops.propName] = ops.value;
    });

  Product
    .update({ _id: productId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.deleteProduct = (req, res) => {
  const { productId } = req.params;

  Product
    .remove({ _id: productId })
    .exec()
    .then(() => res.json({
      message: 'Product deleted',
    }))
    .catch(err => res.status(500).json({ error: err }));
};
