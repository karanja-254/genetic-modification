const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', async (req, res) => {
  try {
    const { data: users, count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    const { count: historyCount } = await supabase
      .from('family_history')
      .select('id', { count: 'exact', head: true });

    const { count: predictionCount } = await supabase
      .from('predictions')
      .select('id', { count: 'exact', head: true });

    const { count: pairingCount } = await supabase
      .from('pairings')
      .select('id', { count: 'exact', head: true });

    res.render('admin', {
      user: req.user,
      users: users || [],
      stats: {
        userCount: userCount || 0,
        historyCount: historyCount || 0,
        predictionCount: predictionCount || 0,
        pairingCount: pairingCount || 0
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

    await supabase
      .from('users')
      .delete()
      .eq('id', id);

    res.redirect('/admin?success=user_deleted');
  } catch (error) {
    res.redirect('/admin?error=delete_failed');
  }
});

router.post('/cleanup-data', async (req, res) => {
  try {
    await supabase
      .from('pairings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    res.redirect('/admin?success=data_cleaned');
  } catch (error) {
    res.redirect('/admin?error=cleanup_failed');
  }
});

module.exports = router;
