const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const Dog = require('../lib/models/Dog');

const request = require('supertest');
const app = require('../lib/app');

describe('dogs routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(async() => {
    return mongoose.connection.dropDatabase();
  });

  let dog;
  beforeEach(async() => {
    dog = await Dog.create({
      name: 'Leo',
      breed: 'Black Lab',
      temperament: 'Calm',
      color: 'Black'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('it creates a new Dog with POST', () => {
    return request(app)
      .post('/api/v1/dogs')
      .send({
        name: 'Leo',
        breed: 'Black Lab',
        temperament: 'Calm',
        color: 'Black'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Leo',
          breed: 'Black Lab',
          temperament: 'Calm',
          color: 'Black',
          __v: 0
        });
      });
  });

  it('it gets a list of all dogs with GET', () => {
    return request(app)
      .get('/api/v1/dogs')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          name: 'Leo',
          breed: 'Black Lab',
          temperament: 'Calm',
          color: 'Black',
          __v: 0
        }]);
      });    
  });

  it('it gets a dog by id with GET', () => {
    return request(app)
      .get(`/api/v1/dogs/${dog._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: dog.id,
          name: 'Leo',
          breed: 'Black Lab',
          temperament: 'Calm',
          color: 'Black',
          __v: 0
        });
      });
  });

  it('it updates a dog with PATCH', () => {
    return request(app)
      .patch(`/api/v1/dogs/${dog._id}`)
      .send({ temperament: 'Crazy' })
      .then(res => {
        expect(res.body).toEqual({
          _id: dog.id,
          name: 'Leo',
          breed: 'Black Lab',
          temperament: 'Crazy',
          color: 'Black',
          __v: 0
        });
      });
  });

  it('it deletes a dog by id with DELETE', () => {
    return request(app)
      .delete(`/api/v1/dogs/${dog._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: dog.id,
          name: 'Leo',
          breed: 'Black Lab',
          temperament: 'Calm',
          color: 'Black',
          __v: 0
        });
      });
  });
});
