const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success',async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200)
  })
});


describe('Test POST /launches', () => {

  const completeLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'Falcon 9',
    target: 'Kepler-22 b',
    launchDate: 'January 4, 2028'
  };

  const incompleteLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'Falcon 9',
    target: 'Kepler-22 b'
  };

  const invalidLaunchDate = {
    mission: 'USS Enterprise',
    rocket: 'Falcon 9',
    target: 'Kepler-22 b',
    launchDate: 'hello'
  }

  test('It should respond with 201 created',async () => {
    const response = await request(app)
      .post('/launches')
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
      .post('/launches')
      .send(incompleteLaunchData)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: 'Missing required launch fields'
    })
  })

  test('It should catch invalid dates',async () => {
    const response = await request(app)
      .post('/launches')
      .send(invalidLaunchDate)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: 'Invalid launch date'
    })
  })
});