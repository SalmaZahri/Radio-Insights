import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importer les routes existantes
import authRoutes from './routes/authRoutes.js';
import radiosRouter from './routes/radios.js';
import userRoutes from './routes/userRoutes.js';

import radiosViewsRoutes from './routes/radiosViews.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// rendre le dossier public comme un dossier de fichiers static par defaut
app.use(express.static(path.join(__dirname, '../frontend/public')));

// route pour le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// Route pour télécharger un fichier audio
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../frontend/public/uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Erreur de téléchargement:', err);
      res.status(404).send('Fichier non trouvé');
    } else {
      console.log('Téléchargement réussi:', filename);
    }
  });
});


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/radios', radiosRouter);
app.use('/api/user', userRoutes);
app.use('/api/radios-views', radiosViewsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Serveur lancé sur http://localhost:" + PORT);
});