const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  breed: {
    type: String,
    required: true
  },

  temperament: {
    type: String,
    required: true
  },

  color: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Dog', schema);
