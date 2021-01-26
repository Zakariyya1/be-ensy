const connection = require('../db/connection');

exports.fetchAllTopics = (sort_by, order) => {
  return connection
    .select('*')
    .from('topics')
    .then(([topicsData]) => {
      return topicsData;
    });
};
