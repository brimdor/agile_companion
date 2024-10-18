const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

// Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);

  if (user && await bcrypt.compare(oldPassword, user.password)) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } else {
    res.status(400).json({ error: 'Old password is incorrect' });
  }
});

// Password Recovery
router.post('/recover-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user) {
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '15m' });
    const recoveryLink = `http://your-app-url/reset-password?token=${token}`;
    sendEmail(email, 'Password Recovery', `Click here to reset your password: ${recoveryLink}`);
    res.json({ message: 'Password recovery email sent' });
  } else {
    res.status(404).json({ error: 'Email not found' });
  }
});

// Update Display Name
router.post('/update-display-name', authenticateToken, async (req, res) => {
  const { displayName } = req.body;
  const user = await User.findByPk(req.user.id);

  if (user) {
    user.displayName = displayName;
    await user.save();
    res.json({ message: 'Display name updated successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update Email
router.post('/update-email', authenticateToken, async (req, res) => {
  const { newEmail } = req.body;
  const user = await User.findByPk(req.user.id);

  if (user) {
    user.email = newEmail;
    await user.save();
    res.json({ message: 'Email updated successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;
