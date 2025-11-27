const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [historyCountResult] = await db.query(
      'SELECT COUNT(*) as count FROM family_history WHERE user_id = ?',
      [req.user.id]
    );

    const [latestPredictionRows] = await db.query(
      'SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    const [pairings] = await db.query(
      'SELECT * FROM pairings WHERE user1_id = ? OR user2_id = ? ORDER BY match_score DESC LIMIT 5',
      [req.user.id, req.user.id]
    );

    const [historyItems] = await db.query(
      'SELECT * FROM family_history WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.render('dashboard', {
      user: req.user,
      historyCount: historyCountResult[0].count || 0,
      latestPrediction: latestPredictionRows[0] || null,
      pairings: pairings || [],
      historyItems: historyItems || []
    });
  } catch (error) {
    res.status(500).send('Error loading dashboard');
  }
});

module.exports = router;
