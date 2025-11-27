const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'goms-secret-key-change-in-production';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await db.query(
      'SELECT id, email, name, age, region, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    const user = users[0];

    if (!user) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

const adminMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access denied. Admin privileges required.');
  }
};

module.exports = { authMiddleware, adminMiddleware, JWT_SECRET };
