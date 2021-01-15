const connection = require('../db/connection');

exports.fetchUser = (username) => {
  return connection('users')
    .where('username', username)
    .returning('*')
    .then(([user]) => {
      return user;
    });
};
