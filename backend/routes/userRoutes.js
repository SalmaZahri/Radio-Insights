import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middlewares/auth.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET /api/user/me - Récupère les infos de l'utilisateur connecté
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, username, email, is_admin FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: rows[0],
      },
    });
  } catch (error) {
    console.error("[GET /me] Erreur:", error);
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Erreur serveur",
    });
  }
});

// GET /api/user/list - liste tous les utilisateurs (id, username, email, is_admin)
router.get("/list", verifyToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, username, email, is_admin FROM users ORDER BY id`
    );
    res.status(200).json({ success: true, users: rows });
  } catch (error) {
    console.error("[GET /list] Erreur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// supprime les utilisateurs a partir d'un id
router.delete("/delete", verifyToken, async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "Aucun id fourni" });
  }
  try {
    await db.query("DELETE FROM users WHERE id = ANY($1)", [ids]);
    res.status(200).json({ success: true, message: "Utilisateurs supprimés" });
  } catch (error) {
    console.error("[DELETE /delete] Erreur:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// ✅ PUT /api/user/profile - Mettre à jour les infos de l'utilisateur
router.put("/profile", verifyToken, async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    const { rows } = await db.query(`SELECT * FROM users WHERE id = $1`, [
      req.user.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = rows[0];

    // Vérification du mot de passe actuel
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Mot de passe actuel incorrect." });
    }

    // Hash du nouveau mot de passe s’il est fourni
    let updatedPassword = user.password;
    if (newPassword && newPassword.trim() !== "") {
      updatedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Mise à jour des données
    await db.query(
      `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4`,
      [name, email, updatedPassword, req.user.id]
    );

    res.status(200).json({ message: "Profil mis à jour avec succès." });
  } catch (error) {
    console.error("[PUT /profile] Erreur:", error);
    res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Erreur lors de la mise à jour du profil.",
    });
  }
});

router.get("/count", async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM users");
    res.json({ totalUsers: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Erreur lors du comptage des utilisateurs :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour récupérer le nombre d'inscriptions par jour
router.get("/registrations-per-day", async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(DATE(created_at), 'DD/MM/YYYY') AS date, 
        COUNT(*) AS count 
      FROM users 
      GROUP BY DATE(created_at) 
      ORDER BY DATE(created_at);
    `;

    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({
        error: "Erreur lors de la récupération des inscriptions par jour",
      });
  }
});


export default router;
