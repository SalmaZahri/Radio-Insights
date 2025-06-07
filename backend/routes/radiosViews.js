import { Router } from 'express';
import db from '../config/db.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post('/', verifyToken, async (req, res) => {
  // Ne récupère plus userId car il n'est pas utilisé
  const { radioId } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO radios_views (radio_id, viewed_at) VALUES ($1, NOW()) RETURNING *',
      [radioId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur insertion radios_views:', err);
    res.status(500).json({ error: 'Erreur lors de l\'insertion dans radios_views' });
  }
});

export default router;
