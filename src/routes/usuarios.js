var express = require('express');
var router = express.Router();
const usuario = require('../models/usuario');


// servicio agregar usuario

router.post('/',function(req,res){
    let u = new usuario (
        {
            nombres:req.body.nombres,
            apellido:req.body.apellido,
            usuario:req.body.usuario,
            direccion:req.body.direccion,
            correo:req.body.correo,
            contrasena:req.body.contrasena,
            rol:req.body.rol,
            identidad:req.body.identidad,
            telefono:req.body.telefono,
            estado:req.body.estado,
            conexiones:[]
        }
    );

    u.save().then(result=>{
        res.send({codigoResultado:1,mensaje:'registro guardado',usuarioGuardado:result});
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end(); 
    });
});

router.post('/login', function(req, res){
    console.log(req.body)
    usuario.findOne({ usuario: req.body.usuario}, (error, result)=> {
        if(error){
            return res.status(500).json({
                ok: false,
                err: error
             })
        }
       
        if (!result) {
            return res.status(400).json({
              ok: false,
              err: {
                  message: "Usuario o contraseña incorrectos"
              }
           })
         }
         return res.status(200).json({
            ok: true,
            data: {
                message: "Usuario correcto"
            }
         })
    })

})



module.exports = router;