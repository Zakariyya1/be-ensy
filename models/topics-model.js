const connection = require('../db/connection');

const fetchAllTopics = (sort_by, order) => {
  return connection
    .select('*')
    .from('topics')
    .then(([topicsData]) => {
      return topicsData;
    });
};

module.exports = { fetchAllTopics };
