const express = require('express');
const articlesRouter = express.Router();
const {
  getArticle,
  patchArticle,
  postCommentByArticleId
} = require('../controllers/articles-controller');

articlesRouter.route('/:article_id').get(getArticle).patch(patchArticle);

articlesRouter.route('/:article_id/comments').post(postCommentByArticleId);

module.exports = articlesRouter;
