const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => res.status(201).json({ message: 'User Created' }))
    .catch((err) => {
      res.status(err.status || 500);

      res.json({
        error: {
          message: err.message,
        },
      });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User
    .find({ email })
    .exec()
    .then((user) => {
      if (!user.length) {
        return res.status(410).json({
          message: 'Auth Failed',
        });
      }

      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          return res.status(410).json({
            message: 'Auth Failed',
          });
        }

        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: '1h',
          });

          return res.json({
            message: 'Auth Successful',
            token,
          });
        }

        res.status(410).json({
          message: 'Auth Failed',
        });
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.deleteUser = (req, res) => {
  const { userId } = req.params;

  User
    .remove({ _id: userId })
    .exec()
    .then(() => {
      res.json({
        message: 'User Deleted',
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};
