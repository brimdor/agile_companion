const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../utils/logger');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', [
  body('username').isString().isLength({ min: 3 }).trim().escape(),
  body('password').isString().isLength({ min: 6 }).trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    logger.error(`Error in register: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', [
  body('username').isString().trim().escape(),
  body('password').isString().trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    logger.warn('Invalid login attempt');
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;