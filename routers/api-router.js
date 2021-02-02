const express = require('express');
const articlesRouter = require('./articles-router');
const apiRouter = express.Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');
const { getAllEndpoints } = require('../controllers/endpoints-controller');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/', getAllEndpoints);

module.exports = apiRouter;
