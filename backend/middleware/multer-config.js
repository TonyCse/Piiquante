// multer requis pour la gestion de fichier
const multer = require('multer');

// format d'image autorisé
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// 
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // indique le dossier 'images' du backend
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// exporation du module avec l'objet storage en paramètre
module.exports = multer({storage: storage}).single('image');