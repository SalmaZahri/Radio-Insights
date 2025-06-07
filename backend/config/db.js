import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // nécessaire pour Railway et autres hébergements
  },
  //user: process.env.DB_USER,
  //password: process.env.DB_PASSWORD,
  //host: process.env.DB_HOST,
  //port: process.env.DB_PORT,
  //database: process.env.DB_NAME,
});

// Testez la connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connexion réussie à la base de données :', res.rows[0].now);
  }
});

export default pool;