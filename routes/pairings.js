const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { generatePairings } = require('../utils/pairingSimulator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [pairings] = await db.query(
      'SELECT * FROM pairings WHERE user1_id = ? OR user2_id = ? ORDER BY match_score DESC',
      [req.user.id, req.user.id]
    );

    const pairingsWithUsers = [];

    for (const pairing of pairings || []) {
      const partnerId = pairing.user1_id === req.user.id ? pairing.user2_id : pairing.user1_id;

      const [partners] = await db.query(
        'SELECT id, name, email, age, region FROM users WHERE id = ?',
        [partnerId]
      );

      const partner = partners[0];

      if (partner) {
        pairingsWithUsers.push({
          ...pairing,
          partner
        });
      }
    }

    res.render('pairings', {
      user: req.user,
      pairings: pairingsWithUsers
    });
  } catch (error) {
    res.status(500).send('Error loading pairings');
  }
});

router.post('/generate', async (req, res) => {
  try {
    const [currentUserHistory] = await db.query(
      'SELECT * FROM family_history WHERE user_id = ?',
      [req.user.id]
    );

    if (!currentUserHistory || currentUserHistory.length === 0) {
      return res.redirect('/pairings?error=no_history');
    }

    const [allUsers] = await db.query(
      'SELECT id FROM users WHERE id != ? AND role = ?',
      [req.user.id, 'user']
    );

    if (!allUsers || allUsers.length === 0) {
      return res.redirect('/pairings?error=no_users');
    }

    await db.query(
      'DELETE FROM pairings WHERE user1_id = ? OR user2_id = ?',
      [req.user.id, req.user.id]
    );

    const pairings = await generatePairings(req.user.id, currentUserHistory, allUsers);

    if (pairings.length > 0) {
      const values = pairings.map(p => [p.user1_id, p.user2_id, p.match_score, p.diversity_level]);
      for (const value of values) {
        await db.query(
          'INSERT INTO pairings (user1_id, user2_id, match_score, diversity_level) VALUES (?, ?, ?, ?)',
          value
        );
      }
    }

    res.redirect('/pairings?success=generated');
  } catch (error) {
    res.redirect('/pairings?error=generation_failed');
  }
});

module.exports = router;
