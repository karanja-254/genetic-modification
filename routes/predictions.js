const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { calculateRiskScore } = require('../utils/riskCalculator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { data: predictions } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

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
    const { data: historyItems } = await supabase
      .from('family_history')
      .select('*')
      .eq('user_id', req.user.id);

    if (!historyItems || historyItems.length === 0) {
      return res.redirect('/predictions?error=no_history');
    }

    const { riskScore, summary } = calculateRiskScore(historyItems);

    const { data: existingPrediction } = await supabase
      .from('predictions')
      .select('id')
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (existingPrediction) {
      await supabase
        .from('predictions')
        .update({
          risk_score: riskScore,
          condition_summary: summary,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPrediction.id);
    } else {
      await supabase
        .from('predictions')
        .insert([{
          user_id: req.user.id,
          risk_score: riskScore,
          condition_summary: summary
        }]);
    }

    res.redirect('/predictions?success=generated');
  } catch (error) {
    res.redirect('/predictions?error=generation_failed');
  }
});

module.exports = router;
