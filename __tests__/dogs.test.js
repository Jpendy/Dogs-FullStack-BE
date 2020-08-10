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

  let dog;
  beforeEach(async() => {
    dog = await Dog.create({
      name: 'Leo',
      breed: 'Black Lab',
      temperament: 'Calm',
      color: 'Black'
    });
    return mongoose.connection.dropDatabase();
    
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

  it('it gets a list of all dogs with GET', async() => {
    await Dog.create({
      name: 'Leo',
      breed: 'Black Lab',
      temperament: 'Calm',
      color: 'Black'
    });

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

});
