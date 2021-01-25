const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

function formattedArticleData(articleData) {
  let formattedArticles = articleData.map((article) => {
    const newArticle = { ...article };
    newArticle.created_at = new Date(newArticle.created_at);

    return newArticle;
  });

  return formattedArticles;
}

function createReferenceObject(arrayOfArticleData) {
  var referenceObject = {};

  arrayOfArticleData.forEach((article) => {
    referenceObject[article.title] = article.article_id;
  });

  return referenceObject;
}

function formattedCommentData(commentsData, referenceObject) {
  let formattedComments = commentsData.map((comment) => {
    const newComment = { ...comment };

    newComment.created_at = new Date(newComment.created_at);
    newComment.author = newComment.created_by;
    newComment.article_id = referenceObject[newComment.belongs_to];

    delete newComment.created_by;
    delete newComment.belongs_to;
    return newComment;
  });

  return formattedComments;
}

module.exports = {
  formattedArticleData,
  createReferenceObject,
  formattedCommentData,
};
