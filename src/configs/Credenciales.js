const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "la-puntada",
  api_key: "962857917515711",
  api_secret: "ezK2Wsa8yqK02Sx_mrZEZckGJa4",
});

module.exports = cloudinary;
