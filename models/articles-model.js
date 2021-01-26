const connection = require('../db/connection');

exports.fetchArticle = (article_id) => {
  return connection('articles')
    .where('article_id', article_id)
    .returning('*')
    .then(([article]) => {
      return Promise.all([
        connection.count('*').from('comments').where('article_id', article_id),
        article,
      ]);
    })
    .then(([[{ count }], article]) => {
      article.comment_count = count;
      return article;
    });
};
