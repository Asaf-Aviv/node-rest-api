const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', function (next) {
  const user = this;

  User.find({ email: user.email })
    .exec()
    .then((result) => {
      if (result.length) {
        const err = new Error('Email Already Exists');
        err.status = 409;
        return next(err);
      }

      bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        user.password = hashedPassword;
        next();
      });
    });
});

userSchema.statics.authenticate = function (email, password, cb) {
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user.length) {
        const err = new Error('Aut.');
        err.status = 401;
        return cb(err);
      }
      bcrypt.compare(password, user.password, (err, result) => (result ? cb(null, user) : cb()));
    });
};

module.exports = User;
