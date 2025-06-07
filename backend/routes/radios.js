import { Router } from 'express';
import db from '../config/db.js';

import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM radios');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ Nouvelle route pour obtenir le total des radios
router.get('/total', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM radios');
    const total = parseInt(result.rows[0].count, 10);
    res.json({ total });
  } catch (err) {
    console.error("Erreur dans /radios/total :", err.message);
    res.status(500).send('Erreur serveur');
  }
});

//route pour ajouter une radio dans la base de donnees
router.post("/add", verifyToken, async (req, res) => {
  const {
    title_id,
    title,
    soundfile_name,
    author,
    duree,
    is_online,
    record_date,
    last_modif_time,
    interpret,
    keywords,
    compagny_disp_name,
    album_disp_name,
    commentaire1,
    commentaire2,
    class_code,
    class_name,
    class_id,
    act,
    composer,
    creator,
    custom1,
    custom2,
    label_reference,
    oeuvre,
    orchestra,
    conductor,
    language,
    voice,
    period,
    soundfile_link,
  } = req.body;

  try {
    const query = `
      INSERT INTO radios (
        title_id, title, soundfile_name, author, duree, is_online,
        record_date, last_modif_time, interpret, keywords,
        compagny_disp_name, album_disp_name, commentaire1, commentaire2,
        class_code, class_name, class_id, act, composer, creator,
        custom1, custom2, label_reference, oeuvre, orchestra,
        conductor, language, voice, period, soundfile_link
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25,
        $26, $27, $28, $29, $30
      ) RETURNING *`;

    const values = [
      title_id,
      title,
      soundfile_name,
      author,
      duree,
      is_online,
      record_date,
      last_modif_time,
      interpret,
      keywords,
      compagny_disp_name,
      album_disp_name,
      commentaire1,
      commentaire2,
      class_code,
      class_name,
      class_id,
      act,
      composer,
      creator,
      custom1,
      custom2,
      label_reference,
      oeuvre,
      orchestra,
      conductor,
      language,
      voice,
      period,
      soundfile_link,
    ];

    const { rows } = await db.query(query, values);
    res.status(201).json({ success: true, radio: rows[0] });
  } catch (error) {
    console.error("Erreur lors de l'insertion de la radio :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});


// GET /api/stats/top-radios
router.get("/top-radios", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        r.title,
        COUNT(rv.id) AS total_views
      FROM radios r
      JOIN radios_views rv ON r.id = rv.radio_id
      GROUP BY r.id, r.title
      ORDER BY total_views DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur top-radios:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// Route pour récupérer le nombre d'émissions ajoutées par jour
router.get("/radios-per-day", async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(DATE(record_date), 'DD/MM/YYYY') AS date,
        COUNT(*) AS count
      FROM radios
      WHERE 
        record_date IS NOT NULL 
        AND record_date <> ''
      GROUP BY DATE(record_date)
      ORDER BY DATE(record_date);
    `;

    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des radios par jour" });
  }
});





export default router;
