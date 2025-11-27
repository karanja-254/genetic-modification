const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { count: historyCount } = await supabase
      .from('family_history')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    const { data: latestPrediction } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: pairings } = await supabase
      .from('pairings')
      .select('*')
      .or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`)
      .order('match_score', { ascending: false })
      .limit(5);

    const { data: historyItems } = await supabase
      .from('family_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    res.render('dashboard', {
      user: req.user,
      historyCount: historyCount || 0,
      latestPrediction,
      pairings: pairings || [],
      historyItems: historyItems || []
    });
  } catch (error) {
    res.status(500).send('Error loading dashboard');
  }
});

module.exports = router;
