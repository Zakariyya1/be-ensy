exports.handleCustomErr = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePSQLErr = (err, req, res, next) => {
  const psqlCodes = ['42703', '22P02', '23502'];

  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: err.message.split(' - ')[1] });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: err.message.split(' - ')[1] });
  } else {
    next(err);
  }
};

exports.handleServerErr = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
