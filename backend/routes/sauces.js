// ajout d'express
const express = require('express');
// appel du routeur
const router = express.Router();
// variable qui appelle le middleware auth.js
const auth = require('../middleware/auth');
// variable qui appelle le middleware multer-config
const multer = require('../middleware/multer-config');
// variable qui appelle le controller sauces.js
const saucesCtrl = require('../controllers/sauces');

// route qui permet de créer une sauce avec appelation du middleware multer
router.post('/', auth, multer, saucesCtrl.createSauce);  
// route qui permet de récupérer toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
// route qui permet de modifier une sauce avec appelation du middleware multer
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// route qui permet de récupérer une sauce séléctionnée
router.get('/:id', auth, saucesCtrl.getOneSauce);
// route qui permet de supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteOneSauce);
// route qui permet de liker ou disliker une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

// exportation de la route
module.exports = router;