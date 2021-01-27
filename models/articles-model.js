const connection = require('../db/connection');

const fetchArticle = (article_id) => {
  return connection('articles')
    .where('article_id', article_id)
    .returning('*')
    .then(([article]) => {
      return Promise.all([
        connection.count('*').from('comments').where('article_id', article_id),
        article
      ]);
    })
    .then(([[{ count }], article]) => {
      if (article) {
        article.comment_count = count;
        return article;
      } else {
        return Promise.reject({
          status: 404,
          msg: `no article found for id: "${article_id}"`
        });
      }
    });
};

const updateArticle = (article_id, inc_votes) => {
  return fetchArticle(article_id)
    .then((article) => {
      return Promise.all([
        article.comment_count,
        connection('articles')
          .update({ votes: article.votes + inc_votes })
          .where('article_id', article_id)
          .returning('*')
      ]);
    })
    .then(([comment_count, [article]]) => {
      article.comment_count = comment_count;
      return article;
    });
};

module.exports = {
  fetchArticle,
  updateArticle
};
