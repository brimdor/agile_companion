const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get notification settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      notifyOnTaskAssignment: user.notifyOnTaskAssignment,
      notifyOnStatusChange: user.notifyOnStatusChange
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// Update notification settings
router.post('/settings', authenticateToken, async (req, res) => {
  const { notifyOnTaskAssignment, notifyOnStatusChange } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.notifyOnTaskAssignment = notifyOnTaskAssignment;
    user.notifyOnStatusChange = notifyOnStatusChange;
    await user.save();

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
