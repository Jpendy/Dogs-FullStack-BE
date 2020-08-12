require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('auth routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('signs up a user with username and password', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'test',
        password: 'password',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test',
        });
      });
  });

  it('logs in a user with email and password', async() => {
    await User.create({
      username: 'test',
      password: 'password',
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'test',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test',
        });
      });
  });

  it('verifies a signed up user', () => {
    const agent = request.agent(app);
    return agent
      .post('/api/v1/auth/signup')
      .send({ username: 'test', password: 'password' })
      .then(() => agent.get('/api/v1/auth/verify'))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test'
        });
      });
  });
});
