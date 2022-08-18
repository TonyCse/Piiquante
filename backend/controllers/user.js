// ajout de bcryp pour hasher le mot de passe
const bcrypt = require('bcrypt')
// ajout de jsonwebtoken pour donner un token à l'utilisateur
const jwt = require('jsonwebtoken');
// importation du schema User
const User = require('../models/User')

/////////////////////////////////// fonction qui permet de créer un compte ///////////////////////////////////
exports.signup = (req, res, next) => {
  // appelle bcrypt dans le mot de passe afin de 'saler' celui ci et on demande à l'algorithme de faire 10 tours afin de le sécuriser
  bcrypt.hash(req.body.password, 10)
  // récupération du hash
    .then(hash => {
      // création du compte
      const user = new User({
        // récupération de l'email et du mdp hashé présent dans le corps de la requête
        email: req.body.email,
        password: hash
      });
      // sauvegarde les identifiants dans la base de donnée
      user.save()
        // si aucune erreur répond 201 created et un message
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        // si erreur répond une erreur 400 et un message d'erreur
        .catch(error => res.status(400).json({ error: error }));
    })
    // si erreur répond une erreur 500 et un message d'erreur
    .catch(error => res.status(500).json({ error: error }));
};


/////////////////////////////////// fonction qui permet de se connecter à un compte créé ///////////////////////////////////
exports.login = (req, res, next) => {
  // vérifie si l'email apparait bien dans la base de donnée
  User.findOne({ email: req.body.email })
    .then(user => {
      // si elle est introuvable répond une erreur 401 + message
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // bcrypt compare le mot de passe de la base de donnée et celui entré
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // si le mot de passe n'est pas valide réponds 401 + message
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // si le mot de passe est valide réponse 200 + réponse json contenant l'ID de l'utilisateur et un token
          res.status(200).json({
            userId: user._id,
            // attribution d'un token
            token: jwt.sign(
              { userId: user._id },
              // clé d'encodage avec délais d'expiration
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        // si erreur répond 500 + message
        .catch(error => res.status(500).json({ error: error }));
    })
    // si erreur répond 500 + message
    .catch(error => res.status(500).json({ error: error }));
};