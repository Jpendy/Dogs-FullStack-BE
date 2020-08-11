const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  passwordHash: {
    type: String,
    required: true
  }

}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash,
      delete ret.__v;
    }
  }
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
});

schema.statics.authorize = function(username, password) {
  return this.findOne({ username })
    .then(user => {
      if(!user) {
        throw new Error('Invalid Username/Password');
      }
      if(!bcrypt.compareSync(password, user.passwordHash)){
        throw new Error('Invalid Username/Password');
      }
      return user;
    });
};

schema.statics.verifyToken = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);
  return this.hydrate(sub);
};

schema.methods.authToken = function() {
  return jwt.sign({ sub: this.toJSON() }, process.env.APP_SECRET, {
    expiresIn: '48h'
  });
};

module.exports = mongoose.model('User', schema);
