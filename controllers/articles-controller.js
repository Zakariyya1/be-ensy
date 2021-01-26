const { fetchArticle } = require('../models/articles-model');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id).then((article) => {
    res.send({ article });
  });
};
