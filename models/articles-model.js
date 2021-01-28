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

const addCommentByArticleId = (article_id, username, body) => {
  const newComment = { author: username, body: body, article_id: article_id };

  return connection('comments')
    .insert(newComment)
    .returning('*')
    .then(([comment]) => comment);
};

const fetchCommentsByArticleId = (article_id, sort_by, order) => {
  if (order !== 'asc' && order !== 'desc' && order)
    return Promise.reject({
      status: 400,
      msg: `Bad request: "${order}" cannot be used as order`
    });
  return connection
    .select('*')
    .from('comments')
    .orderBy(sort_by || 'created_at', order || 'asc')
    .where({ article_id })
    .then((comments) => {
      return comments;
    });
};

module.exports = {
  fetchArticle,
  updateArticle,
  addCommentByArticleId,
  fetchCommentsByArticleId
};
