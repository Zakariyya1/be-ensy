const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');

const dbConfig =
  ENV === 'production'
    ? { connection: process.env.DATABASE_URL, client: 'pg' }
    : require('../knexfile');

const connection = knex(dbConfig);

module.exports = connection;
