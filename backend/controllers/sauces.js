// schema de sauce.js requis
const Sauce = require('../models/sauce');
// importation du package file system afin de modifier le système de fichiers
const fs = require('fs');
const sauce = require('../models/sauce');

/////////////////////////////////// fonction pour créer une sauce ///////////////////////////////////
exports.createSauce = (req, res, next) => {
// transformer la requête envoyée par le frontend en JSON
const sauceObject = JSON.parse(req.body.sauce);
// supprimer l'id mongoose généré par défaut
delete sauceObject._id;
// création du nouvel objet
const sauce = new Sauce({
  // récupération du corps de la requête
  ...sauceObject,
  // modification de l'url de l'image
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  likes: 0,
  dislikes: 0,
  usersLiked: [],
  usersdisLiked: [],
});
// sauvegarde du nouvel objet dans la base de donnée
sauce.save()
// si aucune erreur répond 201 created et un message
  .then(() => res.status(201).json({ message: 'Article enregistrée !' }))
// si erreur répond une erreur 400 et un message d'erreur
  .catch((error) => {res.status(400).json({ error: error })})
};

/////////////////////////////////// fonction pour récupérer toutes les sauces dans la base de donnée ///////////////////////////////////
exports.getAllSauces = (req, res, next) => {
  // utilisation de find() pour trouver les sauces dans la base de donnée, tableau des sauces et réponse 200 si aucune erreur
  Sauce.find()
  .then((sauces) => {res.status(200).json(sauces)})
  // sinon répond une erreur 400
  .catch((error) => {res.status(400).json({ error: error })})
};

/////////////////////////////////// fonction pour récupérer une sauce avec son id dans la base de donnée ///////////////////////////////////
exports.getOneSauce = (req, res, next) => {
  // récupère l'objet avec ses données
  Sauce.findOne({_id: req.params.id})
  // si aucune erreur répond un 200 et l'objet
  .then((sauce) => {res.status(200).json(sauce)})
  // si erreur répond 404 not found
  .catch( (error) => {res.status(404).json({ error: error })})
};

/////////////////////////////////// fonction pour modifier une sauce dans la base de donnée ///////////////////////////////////
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // récupération du deuxième élément du tableau constitué du avant/après '/images/' donc le après
    const filename = sauce.imageUrl.split('/images/')[1];
    // supprime le après '/images/' et début du callback
    console.log(sauce.imageUrl);
    fs.unlink(`images/${filename}`, () => console.log('Image supprimée !'))
    })
  }
  // vérifie si l'objet existe
  const sauceObject = req.file ? {
    // récupération du corps de la requête
    ...JSON.parse(req.body.sauce),
    
    // traitement de la nouvelle image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
  // sinon on modifie juste le corps de la requête
  : { ...req.body }
  // modification de la sauce dans la base de donnée
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  // réponse 200 + message si aucune erreur
  .then(() => res.status(200).json({ message: 'Article modifiée !'}))
  // réponse 400 + message si erreur
  .catch(error => res.status(400).json({ error: error }));
};

/////////////////////////////////// fonction pour supprimer une sauce dans la base de donnée ///////////////////////////////////
exports.deleteOneSauce = (req, res, next) => {
// récupère l'objet avec ses données
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    // récupération du deuxième élément du tableau constitué du avant/après '/images/' donc le après
    const filename = sauce.imageUrl.split('/images/')[1];
    // supprime le après '/images/' et début du callback
    console.log(sauce.imageUrl);
    fs.unlink(`images/${filename}`, () => {
      // supprime la sauce de la base de donnée
      Sauce.deleteOne({ _id: req.params.id })
      // réponse 200 + message si aucune erreur
      .then(() => res.status(200).json({ message: 'Article supprimé !'}))
      // réponse 400 + message si erreur
      .catch(error => res.status(400).json({ error: error }))
    })
  })
// réponse 500 + message si erreur
.catch(error => res.status(500).json({ error: error }));};


/////////////////////////////////// fonction pour liker ou disliker une sauce ///////////////////////////////////
exports.likeSauce = (req, res, next) => {
  // récupération du like présent dans le body (0 par défaut)
  const like = req.body.like;
  // récupération de l'user ID  présent dans le body
  const userId = req.body.userId;
  // si l'utilisateur like
  if (like === 1) {
    // modification de la sauce dans la base de donnée push de l'ID utilisateur dans le tableau et incrémentation du like dans le compteur de like
    Sauce.updateOne({_id: req.params.id},{$push: { usersLiked: userId }, $inc: {likes: 1}})
    // réponse 200 + message
    .then(() => res.status(200).json({ message: "Votre like a été pris en compte!" }))
    // si erreur réponse 400
    .catch(error => res.status(400).json({ error: error }));
  }
  // si l'utilisateur dislike
  else if (like === -1) {
    // modification de la sauce dans la base de donnée push de l'ID utilisateur dans le tableau et incrémentation du dislike dans le compteur dislike
    Sauce.updateOne({_id: req.params.id}, {$push: { usersDisliked: userId }, $inc: {dislikes: 1}})
    .then(() => res.status(200).json({message: "Votre dislike a été pris en compte!"}))
    .catch(error => res.status(400).json({ error: error }))
  }
  // si l'utilisateur enlève son like ou son dislike 
  else if (like === 0) {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      // si l'utilisateur enlève son like
      // vérifie sur l'ID de l'utilisateur apparait bien dans le tableau usersLiked
      if (sauce.usersLiked.includes(userId)) {
          // modification de la sauce, incrémentation du like retiré dans le compteur like et retire l'ID de l'utilisateur dans le tableau usersLiked
          Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
          // réponse 200 + message si aucune erreur   
          .then(() => res.status(200).json({ message: "Votre like à bien été supprimé" }))
          // réponse 400 + message si erreur
          .catch(error => res.status(400).json({ error: error }));
        }
      // si l'utilisateur enlève son dislike
      // vérifie sur l'ID de l'utilisateur apparait bien dans le tableau usersLiked
      if (sauce.usersDisliked.includes(userId)) {
          // modification de la sauce, incrémentation du dislike retiré dans le compteur dislike et retire l'ID de l'utilisateur dans le tableau usersDisliked
          Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
          // réponse 200 + message si aucune erreur 
          .then(() => res.status(200).json({ message: "Votre dislike à bien été supprimé" }))
          // réponse 400 + message si erreur
          .catch(error => res.status(400).json({ error: error }))
      }
    })
  // réponse 500 si erreur
  .catch(error => res.status(500).json({ error: error }))
  }
};
