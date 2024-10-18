const express = require('express');
const { authenticateToken, authorizeRoles, assignRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Fetch all users
router.get('/users', authenticateToken, authorizeRoles('System Administrator', 'Project Owner', 'Project Lead'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Assign role
router.post('/assign', authenticateToken, authorizeRoles('System Administrator', 'Project Owner', 'Project Lead'), assignRole);

module.exports = router;
