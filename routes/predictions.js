const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { calculateRiskScore } = require('../utils/riskCalculator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [predictions] = await db.query(
      'SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.render('predictions', {
      user: req.user,
      predictions: predictions || []
    });
  } catch (error) {
    res.status(500).send('Error loading predictions');
  }
});

router.post('/generate', async (req, res) => {
  try {
    const [historyItems] = await db.query(
      'SELECT * FROM family_history WHERE user_id = ?',
      [req.user.id]
    );

    if (!historyItems || historyItems.length === 0) {
      return res.redirect('/predictions?error=no_history');
    }

    const { riskScore, summary } = calculateRiskScore(historyItems);

    const [existingPredictions] = await db.query(
      'SELECT id FROM predictions WHERE user_id = ?',
      [req.user.id]
    );

    if (existingPredictions.length > 0) {
      await db.query(
        'UPDATE predictions SET risk_score = ?, condition_summary = ?, updated_at = NOW() WHERE id = ?',
        [riskScore, summary, existingPredictions[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO predictions (user_id, risk_score, condition_summary) VALUES (?, ?, ?)',
        [req.user.id, riskScore, summary]
      );
    }

    res.redirect('/predictions?success=generated');
  } catch (error) {
    res.redirect('/predictions?error=generation_failed');
  }
});

module.exports = router;
