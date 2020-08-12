require('dotenv').config();
require('../lib/utils/connect')();
const Dog = require('./models/Dog');

Dog.create({
  name: 'Leo',
  breed: 'Black Lab',
  temperament: 'Calm',
  color: 'Black'
})
  .then(() => console.log('dog created'));

