const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

// Get all tasks
router.get('/', authenticateToken, async (req, res) => {
  const tasks = await Task.findAll({ include: [{ model: User, as: 'assignee' }] });
  res.json(tasks);
});

// Create a new task
router.post('/', authenticateToken, authorizeRoles('Project Owner', 'Project Lead'), async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign a member to a task
router.post('/:taskId/assign', authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Check if the user is authorized to assign
    if (req.user.role === 'Member' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Not authorized to assign this task' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    task.assigneeId = userId;
    await task.save();

    // Send email notification if user settings allow
    if (user.notifyOnTaskAssignment) {
      sendEmail(user.email, 'Task Assignment', `You have been assigned to the task: ${task.title}`);
    }

    res.json({ message: 'Task assigned successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
