const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [historyItems] = await db.query(
      'SELECT * FROM family_history WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.render('history', {
      user: req.user,
      historyItems: historyItems || [],
      error: null,
      success: null
    });
  } catch (error) {
    res.status(500).send('Error loading family history');
  }
});

router.post('/add', async (req, res) => {
  try {
    const { disease_name, relative, notes } = req.body;

    if (!disease_name || !relative) {
      const [historyItems] = await db.query(
        'SELECT * FROM family_history WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );

      return res.render('history', {
        user: req.user,
        historyItems: historyItems || [],
        error: 'Disease name and relative are required',
        success: null
      });
    }

    await db.query(
      'INSERT INTO family_history (user_id, disease_name, relative, notes) VALUES (?, ?, ?, ?)',
      [req.user.id, disease_name, relative, notes || '']
    );

    res.redirect('/history?success=added');
  } catch (error) {
    const [historyItems] = await db.query(
      'SELECT * FROM family_history WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.render('history', {
      user: req.user,
      historyItems: historyItems || [],
      error: 'Failed to add history record',
      success: null
    });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'DELETE FROM family_history WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.redirect('/history?success=deleted');
  } catch (error) {
    res.redirect('/history?error=delete_failed');
  }
});

module.exports = router;
