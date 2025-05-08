const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

// Set up the Redis client
const redisClient = redis.createClient({
  host: 'localhost', // Use Redis service host or `process.env.REDIS_URL` for Render
  port: 6379,        // Default Redis port
});

// Set up session middleware with Redis store
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to `true` if you're using HTTPS in production
});

const app = express();

// Use session middleware globally
app.use(sessionMiddleware);

// Other middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);  // Applying the auth routes

// Set up your app to listen on the appropriate port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
