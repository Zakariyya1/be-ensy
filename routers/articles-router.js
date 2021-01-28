const express = require('express');
const articlesRouter = express.Router();
const {
  getArticle,
  patchArticle,
  postCommentByArticleId,
  getCommentsByArticleId,
  getAllArticles
} = require('../controllers/articles-controller');

articlesRouter.route('/').get(getAllArticles);

articlesRouter.route('/:article_id').get(getArticle).patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId);

module.exports = articlesRouter;
