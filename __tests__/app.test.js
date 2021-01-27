process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const request = require('supertest');
const app = require('../app');

describe('/api', () => {
  afterAll(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  describe('/topics', () => {
    it('GET - 200 - responds with an array of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toEqual(
            { slug: 'mitch', description: 'The man, the Mitch, the legend' },
            { slug: 'cats', description: 'Not dogs' },
            { slug: 'paper', description: 'what books are made of' }
          );
        });
    });
  });

  describe('/users', () => {
    it('GET - 200 - responds with an object of the user associated with the given username', () => {
      return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual({
            username: 'lurker',
            name: 'do_nothing',
            avatar_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
          });
        });
    });

    it('GET - 404 - responds with an error message when specified user is found', () => {
      return request(app)
        .get('/api/users/octogenarian')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('no user was found for username "octogenarian"');
        });
    });
  });

  describe('/articles', () => {
    describe('/:article_id', () => {
      it('GET - 200 - responds with an article object associated with the given article_id', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 100,
              comment_count: '13'
            });
          });
      });

      it('GET - 400 - responds with a bad request error message if user was not requested with a number', () => {
        return request(app)
          .get('/api/articles/Living_in_the_shadow_of_a_great_man')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              'invalid input syntax for type integer: "Living_in_the_shadow_of_a_great_man"'
            );
          });
      });

      it('GET - 404 - responds with an error message when no article is found', () => {
        return request(app)
          .get('/api/articles/101')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('no article found for id: "101"');
          });
      });

      it('PATCH - 201 - responds with the updated item', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 20 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article).toEqual({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 120,
              comment_count: '13'
            });
          });
      });
    });
  });
});
