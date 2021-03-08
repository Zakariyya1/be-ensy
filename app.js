const express = require('express');
const app = express();
const cors = require('cors');
const {
  handleCustomErr,
  handlePSQLErr,
  handleServerErr
} = require('./controllers/errors-controller');
const apiRouter = require('./routers/api-router');
const { getAllEndpoints } = require('./controllers/endpoints-controller');

app.use(cors());

app.use(express.json());

app.use('/', getAllEndpoints);
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  next({ status: 404, msg: 'No Route Found' });
});

app.use(handleCustomErr);
app.use(handlePSQLErr);
app.use(handleServerErr);

module.exports = app;
