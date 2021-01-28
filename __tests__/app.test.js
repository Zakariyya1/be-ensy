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

      it('400 - responds with an error message if there are no inc_votes', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('invalid input syntax for type integer: "NaN"');
          });
      });
    });

    describe('/:article_id/comments', () => {
      it('POST - 201 - responds with the posted comment', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'butter_bridge', body: 'very useful article' })
          .then(({ body: { comment } }) => {
            expect(comment.author).toBe('butter_bridge');
            expect(comment.body).toBe('very useful article');
            expect(comment.article_id).toBe(2);
            expect(comment.votes).toBe(0);
          });
      });

      it('POST - 400 - responds an error message if username is missing', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ body: 'fantastic article' })
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              'null value in column "author" violates not-null constraint'
            );
          });
      });

      it('POST - 404 - responds with an error message if the username does not exist in the database', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({
            username: 'NOT_AN_EXISTING_NAME',
            body: 'fantastic article'
          })
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              'insert or update on table "comments" violates foreign key constraint "comments_author_foreign"'
            );
          });
      });

      it('POST - 400 - responds with an error message if the body is missing', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({
            username: 'butter_bridge'
          })
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              'null value in column "body" violates not-null constraint'
            );
          });
      });

      it('POST - 404 - responds with an error message if article_id was not found', () => {
        return request(app)
          .post('/api/articles/100/comments')
          .send({ username: 'butter_bridge', body: 'fantastic article' })
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              'insert or update on table "comments" violates foreign key constraint "comments_article_id_foreign"'
            );
          });
      });

      it('GET - 200 - responds with all comments associated with the given article_id', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(13);
            expect(comments[0]).toEqual({
              article_id: 1,
              author: 'butter_bridge',
              body: 'This morning, I showered for nine minutes.',
              comment_id: 18,
              created_at: '2000-11-26T12:36:03.389Z',
              votes: 16
            });
          });
      });

      it('200 - responds with all comments associated with the given article_id sorted in descending order of the created_at key', () => {
        return request(app)
          .get('/api/articles/1/comments?order=desc')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(13);
            expect(comments).toBeSortedBy('created_at', { descending: true });
          });
      });

      it('200 - responds with all comments associated with the given article_id and sorted in descending order of votes', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=votes&order=desc')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(13);
            expect(comments[0].author).toBe('icellusedkars');
            expect(comments[0].created_at).toBe(
              new Date(1448282163389).toISOString()
            );
            expect(comments[0].votes).toBe(100);
            expect(comments).toBeSortedBy('votes', { descending: true });
          });
      });

      it('400 - responds with an error message if sort_by query is not a column in the database', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=fruit')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('column "fruit" does not exist');
          });
      });

      it('400 - responds with an error message if order query is not asc or desc', () => {
        return request(app)
          .get('/api/articles/1/comments?order=INVALID')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request: "INVALID" cannot be used as order');
          });
      });
    });
  });
});
