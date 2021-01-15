const express = require('express');
const articlesRouter = require('./articles-router');
const apiRouter = express.Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
