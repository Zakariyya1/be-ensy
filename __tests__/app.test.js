process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const request = require('supertest');
const app = require('../app');

describe('/api', () => {
  afterAll(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  it('GET - 200 - responds with all available endpoints in json format', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: endpoints }) => {
        expect(endpoints).toEqual({
          'GET /api': {
            description:
              'serves up a json representation of all the available endpoints of the api'
          },
          'GET /api/topics': {
            description: 'serves an array of all topics',
            queries: [],
            exampleResponse: {
              topics: [{ slug: 'football', description: 'Footie!' }]
            }
          },
          'GET /api/articles': {
            description: 'serves an array of all topics',
            queries: ['author', 'topic', 'sort_by', 'order', 'limit', 'p'],
            exampleResponse: {
              total_count: 12,
              articles: [
                {
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  topic: 'mitch',
                  author: 'butter_bridge',
                  created_at: '2018-11-15T12:21:54.171Z',
                  votes: 100,
                  comment_count: '13'
                }
              ]
            }
          },
          'GET /api/articles/:article_id': {
            description:
              "serves a JSON object of the article specified by 'article_id'",
            parametricEndpoint: '/:article_id - integer required',
            exampleResponse: {
              article_id: 1,
              title: 'Living in the shadow of a great man',
              body: 'I find this existence challenging',
              topic: 'mitch',
              author: 'butter_bridge',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 100,
              comment_count: '13'
            }
          },
          'PATCH /api/articles/:article_id': {
            description:
              "updates 'votes' of the article specified by 'article_id' and serves a JSON object of the updated article",
            parametricEndpoint: '/:article_id - integer required',
            exampleRequestBody: {
              inc_vote: 1
            },
            exampleResponse: {
              article: {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z',
                votes: 100,
                comment_count: '13'
              }
            }
          },
          'GET /api/users/:username': {
            description:
              "serves a JSON object of the user specified by 'username'",
            parametricEndpoint: '/:username',
            exampleResponse: {
              user: {
                username: 'icellusedkars',
                name: 'Sam',
                avatar_url:
                  'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
              }
            }
          },
          'POST /api/articles/:article_id/comments': {
            description:
              "creates a new comment for the article specified by 'article_id' and serves a JSON object of the posted comment",
            exampleRequestBody: {
              username: 'user',
              body: 'good'
            },
            parametricEndpoint: '/:article_id - integer required',
            exampleResponse: {
              comment: {
                author: 'user',
                body: 'good'
              }
            }
          },
          'GET /api/articles/:article_id/comments': {
            description: "serves an array of comments for 'article_id'",
            parametricEndpoint: '/:article_id - integer required',
            queries: ['sort_by', 'order'],
            exampleResponse: {
              comments: [
                {
                  comment_id: 1,
                  votes: 16,
                  created_at: '2017-11-22T12:36:03.389Z',
                  author: 'butter_bridge',
                  article_id: 9,
                  body:
                    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                }
              ]
            }
          },
          'PATCH /api/comments/:comment_id': {
            description:
              "updates the comment by 'comment_id and serves the updated comment",
            parametricEndpoint: '/:comment_id - integer required',
            exampleRequestBody: {
              inc_votes: 1
            },
            exampleResponse: {
              comment: {
                comment_id: 1,
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                author: 'butter_bridge',
                votes: 17,
                article_id: 9,
                created_at: '2017-11-22T12:36:03.389Z'
              }
            }
          },
          'DELETE /api/comments/:comment_id': {
            description:
              "deletes the comment specified by 'comment_id' with no content served back (204)",
            parametricEndpoint: '/:comment_id - integer required'
          },
          'DELETE /api/articles/:article_id': {
            description:
              "deletes the article specified by 'article_id' with no content served back (204)",
            parametricEndpoint: '/:article_id - integer required'
          },
          'POST /api/topics': {
            description: 'creates a new topic and serves the added topic back',
            exampleRequestBody: {
              slug: 'user',
              description: 'good'
            },
            exampleResponse: {
              topic: {
                slug: 'user',
                description: 'good'
              }
            }
          },
          'POST /api/users': {
            description: 'creates a new user and serves the added user back',
            exampleRequestBody: {
              username: 'testuser',
              name: 'testuser',
              avatar_url: 'placeholder'
            },
            exampleResponse: {
              user: {
                username: 'testuser',
                name: 'user',
                avatar_url: 'placeholder'
              }
            }
          },
          'GET /api/users': {
            description: 'serves an array of users',
            queries: ['sort_by', 'order'],
            exampleResponse: {
              users: [
                {
                  username: 'testuser',
                  name: 'testuser',
                  avatar_url: 'placeholder'
                }
              ]
            }
          }
        });
      });
  });

  describe('/topics', () => {
    it('GET - 200 - responds with an array of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toEqual([
            { slug: 'mitch', description: 'The man, the Mitch, the legend' },
            { slug: 'cats', description: 'Not dogs' },
            { slug: 'paper', description: 'what books are made of' }
          ]);
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
    describe('/', () => {
      it('GET - 200 - responds with all articles sorted in descending order of date', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(12);
            expect(articles).toBeSortedBy('created_at', { descending: true });
            expect(articles[0].topic).toBe('mitch');
            expect(articles[0].author).toBe('butter_bridge');
            expect(articles[0].created_at).toBe(
              new Date(1542284514171).toISOString()
            );
            expect(articles[0].votes).toBe(100);
            expect(articles[0].comment_count).toBe('13');
          });
      });

      it('GET - 200 - responds with all articles sorted by date and in asc order', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(12);
            expect(articles).toBeSortedBy('created_at');
          });
      });

      it('GET - 400 - responds with an error message if order is not asc or desc', () => {
        return request(app)
          .get('/api/articles?order=INVALID')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request: "INVALID" cannot be used as order');
          });
      });

      it('GET - 400 - responds with an error message if sort_by is an unknown column', () => {
        return request(app)
          .get('/api/articles?sort_by=NOT_A_COLUMN')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('column articles.NOT_A_COLUMN does not exist');
          });
      });

      it('GET - 200 - responds with all articles sorted by votes and in asc order', () => {
        return request(app)
          .get('/api/articles?sort_by=votes&order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(12);
            expect(articles).toBeSortedBy('votes');
          });
      });

      it('GET - 200 - responds with all articles related to specified author', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(3);
            expect(articles[0].author).toBe('butter_bridge');
            expect(articles[0].votes).toBe(100);
            expect(articles[0].created_at).toBe(
              new Date(1542284514171).toISOString()
            );
          });
      });

      it('GET - 404 - responds with an error if there are no articles found for the specified author', () => {
        return request(app)
          .get('/api/articles?author=NOT_A_VALID_NAME')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('No article found for "NOT_A_VALID_NAME"');
          });
      });

      it('GET - 200 - responds with all articles related to specified topic', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(11);
            expect(articles[0].topic).toBe('mitch');
          });
      });

      it('GET - 404 - responds with an error if there are no articles found for the specified topic', () => {
        return request(app)
          .get('/api/articles?topic=NOT_A_VALID_NAME')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('No article found for "NOT_A_VALID_NAME"');
          });
      });

      it('GET - 200 - responds with the articles if the author, topic, sort_by and order are all set', () => {
        return request(app)
          .get(
            '/api/articles?topic=mitch&author=icellusedkars&sort_by=title&order=asc'
          )
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(6);
            expect(articles).toBeSortedBy('title');
            expect(articles[0].title).toBe('A');
          });
      });
    });

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

      it('GET - 400 - responds with an error message if user was not requested with a number', () => {
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

      it('GET - 200 - responds with all comments associated with the given article_id sorted in descending order of the created_at key', () => {
        return request(app)
          .get('/api/articles/1/comments?order=desc')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(13);
            expect(comments).toBeSortedBy('created_at', { descending: true });
          });
      });

      it('GET - 200 - responds with all comments associated with the given article_id and sorted in descending order of votes', () => {
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

      it('GET - 400 - responds with an error message if sort_by query is not a column in the database', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=fruit')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('column "fruit" does not exist');
          });
      });

      it('GET - 400 - responds with an error message if order query is not asc or desc', () => {
        return request(app)
          .get('/api/articles/1/comments?order=INVALID')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request: "INVALID" cannot be used as order');
          });
      });
    });
  });

  describe('/comments/:comment_id', () => {
    it('PATCH - 201 - responds with the updated comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1 })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual({
            comment_id: 1,
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            author: 'butter_bridge',
            votes: 17,
            article_id: 9,
            created_at: new Date(1511354163389).toISOString()
          });
        });
    });

    it('PATCH - 400 - responds with an error message if comment_id is not specified as a number', () => {
      return request(app)
        .patch('/api/comments/INVALID_NUMBER')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'invalid input syntax for type integer: "INVALID_NUMBER"'
          );
        });
    });

    it('PATCH - 404 - responds with an error message if comment_id cannot be found in the database', () => {
      return request(app)
        .patch('/api/comments/10000')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('No comment found for "10000"');
        });
    });

    it('PATCH - 400 - responds with an error message if no inc_vote is provided', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('invalid input syntax for type integer: "NaN"');
        });
    });

    it('PATCH - 400 - responds with an error message if inc_votes contains invalid data', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 'INVALID' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'invalid input syntax for type integer: "16INVALID"'
          );
        });
    });

    it('PATCH - 422 - responds with an error message if extra key-value pairs are sent with the patch', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1, name: 'Mitch' })
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('cannot process the entity');
        });
    });

    it('DELETE - 204 - responds with no content status code after deleting', () => {
      return request(app).delete('/api/comments/1').expect(204);
    });

    it('DELETE - 404 - responds with an error message if comment_id does not exist', () => {
      return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('No comment found for "999"');
        });
    });
  });
});
