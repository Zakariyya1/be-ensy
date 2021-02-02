const { fetchAllEndpoints } = require('../models/endpoints-model');

exports.getAllEndpoints = (req, res, next) => {
  fetchAllEndpoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      next(err);
    });
};
