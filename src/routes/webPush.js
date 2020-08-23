var express = require("express");
const AutenticationToken = require("../middlewares/autenticationJWT");
const router = express.Router();
const Result = require("../helpers/result");
const Usuario = require("../models/usuario");
const estructuraBitacora = require("../helpers/esquemaBitacora");
const decodeJWT = require("../configs/decodedJWT");
const AutenticacionLv1 = require("../middlewares/autenticacionLvl1");
const usuario = require("../models/usuario");

const webpush = require('../configs/webPush');
let pushSubscripton;

router.post("/subscribe/user", async (req, res) => {
  pushSubscripton = req.body;
  console.log(pushSubscripton);

  // Server's Response
  res.status(201).json();
});

router.get("/new-message/:message", async (req, res) => {
  const { message } = req.body;
  // Payload Notification
  const payload = JSON.stringify({
    title: "My Custom Notification",
    message: req.params.message,
  });
  res.send('ok');
  try {
    await webpush.sendNotification(pushSubscripton, payload);
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
