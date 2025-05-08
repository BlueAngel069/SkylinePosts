const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

// Configure Redis client
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

const app = express();

// Middleware for file upload
const upload = multer({
  dest: path.join(__dirname, 'public/uploads/profiles'),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// Session middleware
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using https in production
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like images

// Handle profile picture upload and user data update
app.post('/profile/update', upload.single('profilePic'), (req, res) => {
  const profilePic = req.file ? req.file.filename : null; // Save the file name

  db.run('UPDATE users SET profilePic = ? WHERE username = ?', [profilePic, req.session.user.username], function (err) {
    if (err) return res.send('Error updating profile picture!');
    res.redirect('/profile');
  });
});

// Other routes for login, registration, logout, etc.
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
