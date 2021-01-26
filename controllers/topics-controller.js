const { fetchAllTopics } = require('../models/topics-model');

exports.getTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => next(err));
};
