const connection = require('../db/connection');

const fetchUser = (username) => {
  return connection('users')
    .where('username', username)
    .returning('*')
    .then(([user]) => {
      if (user) return user;
      else {
        return Promise.reject({
          status: 404,
          msg: `no user was found for username "${username}"`
        });
      }
    });
};

module.exports = { fetchUser };
