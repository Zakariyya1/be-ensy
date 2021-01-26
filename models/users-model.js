const connection = require('../db/connection');

exports.fetchUser = (username) => {
  return connection('users')
    .where('username', username)
    .returning('*')
    .then(([user]) => {
      if (user) return user;
      else {
        return Promise.reject({
          status: 404,
          msg: `No user was found for username "${username}"`,
        });
      }
    });
};
