const endpoints = require('../endpoints.json');

const fetchAllEndpoints = () => {
  return Promise.resolve(endpoints);
};

module.exports = { fetchAllEndpoints };
