const multer = require("multer"); //Modulo para gestion de imagenes
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads"),
  filename: (req, file, cb) => {
    cb(
      null,
      req.headers["name-file"] +
      path.extname(file.originalname)
    );
  },
}); //Almacenamiento de imagenes de perfil

module.exports = storage;
