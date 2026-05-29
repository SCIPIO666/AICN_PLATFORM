
const { NotFoundError } = require('../utils/errors/customErrors');

const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url}`));
};

module.exports = { notFoundHandler };