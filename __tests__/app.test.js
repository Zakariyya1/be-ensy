process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe('/api', () => {
  describe('/topics', () => {
    it('GET - 200 - responds with an array of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            { slug: 'mitch', description: 'The man, the Mitch, the legend' },
            { slug: 'cats', description: 'Not dogs' },
            { slug: 'paper', description: 'what books are made of' }
          );
        });
    });
  });

  describe('/users/:username', () => {
    it('GET - 200 - responds with an object of the user associated with the given username', () => {});
  });
});
