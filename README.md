# Ensy API

This project is a news API which has been built with psql as the database. Knex is used to interact with the database.

The API responds with the data needed to build a news site. Data contains topics, articles, comments and users.

A hosted version can be found on [Heroku](http://be-ensy.herokuapp.com/api)

## Tech:

- PostgreSQL
- Node.js
- Knex
- Express
- Jest
- Supertest

## Getting Started

To run this project, please ensure [Node.js](https://nodejs.org/en/download/) and [Postgres](https://www.postgresql.org/download/) have been installed.

To clone the repository use the following command in your terminal:

```
git clone https://github.com/Zakariyya1/be-ensy.git
```

Once cloned, install dependencies:

```
npm install
```

Next, create a [knexfile](http://knexjs.org/#knexfile) to connect to PostgreSQL, replace user and password with your PostgreSQL username and password:

```
const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  development: {
    connection: {
      database: 'nc_news'
      // user,
      // password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'
      // user,
      // password
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

```

Then, seed the database using the scripts in the package.json file:

```
npm run setup-dbs
```

```
npm run seed-test
```

Finally, to run the tests use the test script:

```
npm test app
```
