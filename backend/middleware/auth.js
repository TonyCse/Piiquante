// ajout de jsonwebtoken pour donner un token à l'utilisateur
const jwt = require('jsonwebtoken');

/////////////////////////////////// fonction qui permet ///////////////////////////////////
module.exports = (req, res, next) => {
  try {
    // récupère le token dans le header de la requête authorization
    const token = req.headers.authorization.split(' ')[1];
    // vérifie le token avec la clé secrète
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // vérifie si le token dans le header authorization est le même que celui de l'utilisateur
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Utilisateur non autorisé';
    } else {
      // si tout est bon on execute le middleware suivant en fonction de l'action utilisateur
      next();
    }
  } catch {
    // répond une erreur 401 si problème d'authentification
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};