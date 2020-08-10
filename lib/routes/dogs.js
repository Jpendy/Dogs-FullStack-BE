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

  .get('/:id', (req, res, next) => {
    Dog
      .findById(req.params.id)
      .then(dog => res.send(dog))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Dog
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(dog => res.send(dog))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Dog
      .findByIdAndDelete(req.params.id)
      .then(dog => res.send(dog))
      .catch(next);
  });
