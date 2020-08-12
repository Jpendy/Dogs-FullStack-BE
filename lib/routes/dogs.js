const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Dog = require('../models/Dog');


module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Dog
      .create(req.body)
      .then(dog => res.send(dog))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Dog
      .find({ user: req.user._id })
      .then(dogs => res.send(dogs))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Dog
      .findOne({ user: req.user._id, _id: req.params.id })
      .then(dog => res.send(dog))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Dog
      .findOneAndUpdate({ user: req.user._id, _id: req.params.id }, req.body, { new: true })
      .then(dog => res.send(dog))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Dog
      .findOneAndDelete({ user: req.user._id, _id: req.params.id })
      .then(dog => res.send(dog))
      .catch(next);
  });
