const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const Dog = require('../lib/models/Dog');
const User = require('../lib/models/User');

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
  const agent = request.agent(app);
  beforeEach(async() => {
    const res = await agent
      .post('/api/v1/auth/signup')
      .send({
        username: 'user0',
        password: 'password0'
      });

    // eslint-disable-next-line no-unused-vars
    dog = await Dog.create({
      user: res.body._id,
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

  const getLoggedInUser = () => User.findOne({ username: 'user0' });
  const prepareOne = model => JSON.parse(JSON.stringify(model));
  const prepareMany = models => models.map(prepareOne);

  const prepare = model => {
    if(Array.isArray(model)) return prepareMany(model);
    return prepareOne(model);
  };

  it('it creates a new Dog with POST', async() => {
    const user = await getLoggedInUser();

    return agent
      .post('/api/v1/dogs')
      .send({
        user: user._id,
        name: 'Leo',
        breed: 'Black Lab',
        temperament: 'Calm',
        color: 'Black'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          name: 'Leo',
          breed: 'Black Lab',
          temperament: 'Calm',
          color: 'Black',
          __v: 0
        });
      });
  });

  it('it gets a list of all dogs with GET', async() => {
    const user = await getLoggedInUser();
    const posts = prepare(await Dog.find({ user: user._id }));

    return agent
      .get('/api/v1/dogs')
      .then(res => {
        expect(res.body).toEqual(posts);
      });    
  });

  it('it gets a dog by id with GET', async() => {
    const dog = prepare(await Dog.findOne());

    return agent
      .get(`/api/v1/dogs/${dog._id}`)
      .then(res => {
        expect(res.body).toEqual(dog);
      });
  });

  it('it updates a dog with PATCH', async() => {
    const user = await getLoggedInUser();
    const dog = prepare(await Dog.findOne({ user: user._id }));

    return agent
      .patch(`/api/v1/dogs/${dog._id}`)
      .send({ temperament: 'Crazy' })
      .then(res => {
        expect(res.body).toEqual({
          user: user.id,
          _id: dog._id,
          name: 'Leo',
          breed: 'Black Lab',
          temperament: 'Crazy',
          color: 'Black',
          __v: 0
        });
      });
  });

  it('it deletes a dog by id with DELETE', async() => {
    const user = await getLoggedInUser();
    const dog = prepare(await Dog.findOne({ user: user._id }));

    return agent
      .delete(`/api/v1/dogs/${dog._id}`)
      .then(res => {
        expect(res.body).toEqual(dog);
      });
  });
});
