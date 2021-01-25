const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');
const {
  formattedArticleData,
  createReferenceObject,
  formattedCommentData,
} = require('../utils/data-manipulation');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics').insert(topicData).returning('*');
    })
    .then((insertedTopics) => {
      return knex('users').insert(userData).returning('*');
    })
    .then((insertedUsers) => {
      let formattedData = formattedArticleData(articleData);
      return knex('articles').insert(formattedData).returning('*');
    })
    .then((insertedArticle) => {
      let referenceObject = createReferenceObject(insertedArticle);
      let formattedComments = formattedCommentData(
        commentData,
        referenceObject
      );
      return knex('comments').insert(formattedComments).returning('*');
    });
};
