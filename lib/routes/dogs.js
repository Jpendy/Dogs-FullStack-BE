const { Router } = require('express');
const Dog = require('../models/Dog');

module.exports = Router()
  .post('/', (req, res, next) => {
    Dog
      .create(req.body)
      .then(dog => res.send(dog))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Dog
      .find()
      .then(dogs => res.send(dogs))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Dog
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(dog => res.send(dog))
      .catch(next);
  });
