const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { generatePairings } = require('../utils/pairingSimulator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { data: pairings } = await supabase
      .from('pairings')
      .select('*')
      .or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`)
      .order('match_score', { ascending: false });

    const pairingsWithUsers = [];

    for (const pairing of pairings || []) {
      const partnerId = pairing.user1_id === req.user.id ? pairing.user2_id : pairing.user1_id;

      const { data: partner } = await supabase
        .from('users')
        .select('id, name, email, age, region')
        .eq('id', partnerId)
        .maybeSingle();

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
    const { data: currentUserHistory } = await supabase
      .from('family_history')
      .select('*')
      .eq('user_id', req.user.id);

    if (!currentUserHistory || currentUserHistory.length === 0) {
      return res.redirect('/pairings?error=no_history');
    }

    const { data: allUsers } = await supabase
      .from('users')
      .select('id')
      .neq('id', req.user.id)
      .eq('role', 'user');

    if (!allUsers || allUsers.length === 0) {
      return res.redirect('/pairings?error=no_users');
    }

    await supabase
      .from('pairings')
      .delete()
      .or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`);

    const pairings = await generatePairings(req.user.id, currentUserHistory, allUsers);

    if (pairings.length > 0) {
      await supabase
        .from('pairings')
        .insert(pairings);
    }

    res.redirect('/pairings?success=generated');
  } catch (error) {
    res.redirect('/pairings?error=generation_failed');
  }
});

module.exports = router;
