// What do we use to test our code?
// Test runner: which will run our tests and give us the results
// Test fixtures: how our tests are set up
// Assertions: what we expect to happen
// Mocks: what we use to test our code (fake data)

// Jest is a test runner that runs our tests
// we use Supertest to make requests to our server

const request = require('supertest');
const app = require('../../app');
const {
  mongoConnect,
  mongoDisconnect
} = require('../../services/mongo');

describe('Launches API', () => {

  // Run this before all tests
  beforeAll(async () => {
    await mongoConnect();
  });

  // Run this after all tests
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success',async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200)
    })
  });


  describe('Test POST /launches', () => {

    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'Falcon 9',
      target: 'Kepler-712 c',
      launchDate: 'January 4, 2028'
    };

    const incompleteLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'Falcon 9',
      target: 'Kepler-712 c'
    };

    const invalidLaunchDate = {
      mission: 'USS Enterprise',
      rocket: 'Falcon 9',
      target: 'Kepler-712 c',
      launchDate: 'hello'
    }

    test('It should respond with 201 created',async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(incompleteLaunchData);
    })

    test('It should catch missing required properties',async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(incompleteLaunchData)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Missing required launch fields'
      })
    })

    test('It should catch invalid dates',async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(invalidLaunchDate)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
      })
    })
  });
});