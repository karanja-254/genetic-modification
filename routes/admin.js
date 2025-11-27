const express = require('express');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );

    const [userCountResult] = await db.query(
      'SELECT COUNT(*) as count FROM users'
    );

    const [historyCountResult] = await db.query(
      'SELECT COUNT(*) as count FROM family_history'
    );

    const [predictionCountResult] = await db.query(
      'SELECT COUNT(*) as count FROM predictions'
    );

    const [pairingCountResult] = await db.query(
      'SELECT COUNT(*) as count FROM pairings'
    );

    res.render('admin', {
      user: req.user,
      users: users || [],
      stats: {
        userCount: userCountResult[0].count || 0,
        historyCount: historyCountResult[0].count || 0,
        predictionCount: predictionCountResult[0].count || 0,
        pairingCount: pairingCountResult[0].count || 0
      }
    });
  } catch (error) {
    res.status(500).send('Error loading admin panel');
  }
});

router.post('/delete-user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.redirect('/admin?error=cannot_delete_self');
    }

    await db.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    res.redirect('/admin?success=user_deleted');
  } catch (error) {
    res.redirect('/admin?error=delete_failed');
  }
});

router.post('/cleanup-data', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM pairings WHERE 1=1'
    );

    res.redirect('/admin?success=data_cleaned');
  } catch (error) {
    res.redirect('/admin?error=cleanup_failed');
  }
});

module.exports = router;
