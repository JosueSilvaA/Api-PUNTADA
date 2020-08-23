const webpush = require("../configs/webPush");
const endPointUsuarios = require("../models/endPointUsuario");

const saveEndPoint = (idUsuario, endP) => {
  // const endPo = JSON.stringify(endP)
  // console.log(endPo)
  
  endPointUsuarios.find({'usuario': idUsuario}, {usuario: true})
  .then((res) => {
    if (res.length === 0) {
      let newEndPoint = new endPointUsuarios({
        userEndPoint: endP,
        usuario: idUsuario,
      });
      newEndPoint.save().then((res) => {
          return true
      })
      .catch(err => {
        console.log(err)
      })
      
    } else {
      endPointUsuarios.updateOne({'usuario': idUsuario}, {userEndPoint: endP })
      .then((response) => {
        return true
      })
    }
  })

};

module.exports = saveEndPoint;
