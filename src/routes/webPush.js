var express = require("express");
const AutenticationToken = require("../middlewares/autenticationJWT");
const router = express.Router();
const saveEndPoint = require('../helpers/saveEndPoint');
const { sendNotification, sendAdminNotification } = require('../helpers/SendPushNotification')
const endPointUsuario = require("../models/endPointUsuario");


const webpush = require('../configs/webPush');

router.post("/subscribe/user", AutenticationToken, async (req, res) => {
  let pushSubscripton = req.body;
  await saveEndPoint(req.decoded.id,pushSubscripton);
  // Server's Response
  // console.log(typeof(pushSubscripton))
  // let temp = JSON.stringify(pushSubscripton)
  // console.log(typeof(temp))
  res.status(201).json();
  sendNotification(req.decoded.id, `Bienvenido ${req.decoded.user}!`, 'Saludos La Puntada.')
});

router.get("/new-message", async (req, res) => {
  const { message } = req.body;
  console.log('holaaa')
  // Payload Notification
  // const result = await endPointUsuario.findOne({usuario: '5f409481ea2ebc0017c54b2f' }, {userEndPoint: true})
/*   const payload = JSON.stringify({
    title: "Prueba de notificación",
    message: message,
  });
  try {
    await webpush.sendNotification(result.userEndPoint, payload);
  } catch (error) {
    console.log(error);
  };  */
  // sendNotification(ent, 'prueba', 'esta es una prueba')
  sendNotification('5f40a736ea2ebc0017c54b39', 'Saludos', 'Saludos La Puntada.')
  
  res.send('ok');
});

router.get('/prueba', (req, res) => {
  sendAdminNotification('Prueba', 'Notificación solo para admins!');
  // sendNotification(ent, 'prueba', 'esta es una prueba')

  res.send('ok')
}) 


module.exports = router;
