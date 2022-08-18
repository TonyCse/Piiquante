// ajout d'express
const express = require('express');
// appel du routeur
const router = express.Router();

// importation du controller user.js afin de relier les fonctions de ce dernier au routeur user.js
const userCtrl = require('../controllers/user');

// assigniation des controllers aux routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// exportation de la route
module.exports = router;