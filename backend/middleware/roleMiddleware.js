const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

async function assignRole(req, res) {
  const { userId, role } = req.body;
  const allowedRoles = ['System Administrator', 'Project Owner', 'Project Lead'];

  if (!allowedRoles.includes(req.user.role)) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { authenticateToken, authorizeRoles, assignRole };
