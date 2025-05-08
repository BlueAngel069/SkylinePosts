require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const profileRoutes = require('./routes/profile'); // ✅ added

app.use(express.urlencoded({ extended: false }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use('/', authRoutes);
app.use('/blog', blogRoutes);
app.use('/profile', profileRoutes); // ✅ added

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

