const { fetchUser } = require('../models/users-model');

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  fetchUser(username).then((user) => {
    res.send(user);
  });
};
