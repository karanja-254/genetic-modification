const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { data: historyItems } = await supabase
      .from('family_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

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
      const { data: historyItems } = await supabase
        .from('family_history')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      return res.render('history', {
        user: req.user,
        historyItems: historyItems || [],
        error: 'Disease name and relative are required',
        success: null
      });
    }

    const { error } = await supabase
      .from('family_history')
      .insert([{
        user_id: req.user.id,
        disease_name,
        relative,
        notes: notes || ''
      }]);

    if (error) {
      throw error;
    }

    res.redirect('/history?success=added');
  } catch (error) {
    const { data: historyItems } = await supabase
      .from('family_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

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

    const { error } = await supabase
      .from('family_history')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.redirect('/history?success=deleted');
  } catch (error) {
    res.redirect('/history?error=delete_failed');
  }
});

module.exports = router;
