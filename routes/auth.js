const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.get('/register', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, age, region } = req.body;

    if (!email || !password) {
      return res.render('register', { error: 'Email and password are required' });
    }

    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.render('register', { error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, name, age, region, role) VALUES (?, ?, ?, ?, ?, ?)',
      [email, passwordHash, name || '', age ? parseInt(age) : 0, region || '', 'user']
    );

    const [newUserRows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const newUser = newUserRows[0];

    if (!newUser) {
      return res.render('register', { error: 'Registration failed. Please try again.' });
    }

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.redirect('/dashboard');
  } catch (error) {
    res.render('register', { error: 'An error occurred during registration' });
  }
});

router.get('/login', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('login', { error: 'Email and password are required' });
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = users[0];

    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { error: 'An error occurred during login' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
