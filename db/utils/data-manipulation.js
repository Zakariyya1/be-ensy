// extract any functions you are using to manipulate your data, into this file
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
  for (let i = 0; i < arrayOfArticleData.length; i++) {
    referenceObject[arrayOfArticleData[i].title] =
      arrayOfArticleData[i].article_id;
  }

  return referenceObject;
}

function formattedcommentData(commentsData, referenceObject) {
  for (let i = 0; i < commentsData.length; i++) {
    let formatted = new Date(commentsData[i].created_at);
    commentsData[i].created_at = formatted;
    commentsData[i].article_id = referenceObject[commentsData[i].belongs_to];
    commentsData[i].author = commentsData[i].created_by;
    delete commentsData[i].created_by;
    delete commentsData[i].belongs_to;
  }

  return commentsData;
}

module.exports = {
  formattedArticleData,
  createReferenceObject,
  formattedcommentData,
};
