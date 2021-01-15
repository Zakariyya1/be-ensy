const connection = require('../db/connection');

exports.fetchArticle = (article_id) => {
  return connection('articles')
    .where('article_id', article_id)
    .returning('*')
    .then(([article]) => {
      return article;
    });
};
