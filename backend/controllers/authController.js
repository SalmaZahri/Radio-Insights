import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/User.js';

export const registerUser = async (req, res) => {

  const { username, email, password } = req.body;

  console.log("📥 Reçu pour inscription :", req.body);

  try {
    const existingUser = await findUserByEmail(email);
    console.log("🔍 Recherche utilisateur existant :", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Mot de passe hashé");

    const user = await createUser(username, email, hashedPassword);
    console.log("✅ Utilisateur créé :", user);

    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    console.error("❌ Erreur lors de l'inscription :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("📥 Reçu pour login :", req.body);

  try {
    const user = await findUserByEmail(email);
    console.log("🔍 Utilisateur trouvé :", user);

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
