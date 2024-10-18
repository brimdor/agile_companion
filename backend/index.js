const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const roleRoutes = require('./routes/roles');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notifications');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const csrf = require('csurf');
const rateLimiter = require('./middleware/rateLimiter');
const httpsRedirect = require('./middleware/httpsRedirect');

const app = express();
const PORT = process.env.PORT || 3000;

// Load SSL/TLS certificate and key
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.cert'))
};

// Redirect HTTP to HTTPS
app.use(httpsRedirect);

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Ensure cookies are only sent over HTTPS
}));

// Set up CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Apply rate limiting to all requests
app.use(rateLimiter);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/roles', roleRoutes);
app.use('/user', userRoutes);
app.use('/notifications', notificationRoutes);

// Centralized error handling
app.use(errorHandler);

sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`Server running on port ${PORT} over HTTPS`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
