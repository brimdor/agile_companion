const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
