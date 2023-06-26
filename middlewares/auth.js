const jwt = require('jsonwebtoken');

const Unauthorized = require('../utils/errors/Unauthorized');


module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходимо авторизоваться'));
  }

  let payload;
  // токен
  const userToken = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(userToken, 'safekey');
  } catch (_) {
    return next(new Unauthorized('Необходимо авторизоваться'));
  }

  req.user = payload;
  next();
};