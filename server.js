require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const historyRoutes = require('./routes/history');
const predictionsRoutes = require('./routes/predictions');
const pairingsRoutes = require('./routes/pairings');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.get('/', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/dashboard');
  }
  res.render('index', { layout: false });
});

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/history', historyRoutes);
app.use('/predictions', predictionsRoutes);
app.use('/pairings', pairingsRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GOMS server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
