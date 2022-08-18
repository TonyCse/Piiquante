// ajout d'express
const express = require('express');
const dotenv = require('dotenv').config()
// ajout mongoose pour la base de donnée
const mongoose = require('mongoose');
// ajout de path pour gérer le chemin du fichier dans notre systeme
const path = require('path');


// importation des routes sauces.js et user.js
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// création de l'appli express
const app = express();

// ajout du middleware express.json afin d'extraire le corps JSON pour la requête POST
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Contourner les erreurs de CORS
app.use((req, res, next) => {
  // autoriser l'accès à l'API depuis n'importe quel port
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ajout des headers aux requêtes envoyées à l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // ajout des méthodes pour envoyer des requêtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// charger des fichiers depuis notre dossier image
app.use('/images', express.static(path.join(__dirname, 'images')));

// utilisation des routes importées
app.use('/api/sauces', sauceRoutes) 
app.use('/api/auth', userRoutes);

// exportation de l'application express
module.exports = app;