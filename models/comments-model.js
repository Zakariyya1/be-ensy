const connection = require('../db/connection');

const updateCommentById = (comment_id, votesObj) => {
  if (Object.keys(votesObj).length > 1)
    return Promise.reject({ status: 422, msg: 'cannot process the entity' });

  return connection('comments')
    .select('votes')
    .where({ comment_id })
    .then(([votes]) => {
      if (!votes)
        return Promise.reject({
          status: 404,
          msg: `No comment found for "${comment_id}"`
        });

      return connection('comments')
        .update({ votes: votes.votes + votesObj.inc_votes })
        .where({ comment_id })
        .returning('*');
    })
    .then(([comment]) => comment);
};

const removeCommentById = (comment_id) => {
  return connection('comments')
    .del()
    .where({ comment_id })
    .then((del_count) => {
      if (!del_count)
        return Promise.reject({
          status: 404,
          msg: `No comment found for "${comment_id}"`
        });
      return;
    });
};

module.exports = { updateCommentById, removeCommentById };
