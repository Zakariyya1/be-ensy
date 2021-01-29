const {
  updateCommentById,
  removeCommentById
} = require('../models/comments-model');

exports.patchCommentById = (req, res, next) => {
  const votesObj = req.body;
  const { comment_id } = req.params;
  updateCommentById(comment_id, votesObj)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => res.sendStatus(204))
    .catch(next);
};
