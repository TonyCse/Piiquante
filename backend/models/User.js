// ajout de mongoose pour la base de donnée
const mongoose = require('mongoose');
// ajout de mangoose-unique-validator afin d'empecher deux utilisateurs d'avoir la même adresse email
const uniqueValidator = require('mongoose-unique-validator');

// Ajout du schéma de données pour chaque utilisateur
const userSchema = mongoose.Schema({
  // indique que l'email est requis et qu'il ne doit pas déjà être utilisé
  email: { type: String, required: true, unique: true },
  // indique qu'un mot de passe est requis
  password: { type: String, required: true }
});

// indique que userSchema doit prendre en compte la variable uniqueValidator
userSchema.plugin(uniqueValidator);

// eportation du schema pour l'appeler dans le controller user.js
module.exports = mongoose.model('User', userSchema);