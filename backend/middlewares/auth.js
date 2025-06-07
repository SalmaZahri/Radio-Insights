import jwt from 'jsonwebtoken';

// Middleware pour vérifier le token JWT
export const verifyToken = (req, res, next) => {
  // Récupérer le token dans les en-têtes Authorization
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
  // Si le token n'est pas présent
  if (!token) {
    return res.status(403).json({ message: 'Accès interdit, token manquant' });
  }

  try {
    // Vérifier le token en utilisant la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter les informations de l'utilisateur décodées au request
    req.user = decoded;
    
    // Passer à la prochaine étape (middleware ou route)
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};


