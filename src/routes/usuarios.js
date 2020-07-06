var express = require('express');
var router = express.Router();
var Result = require('../helpers/result')
const usuario = require('../models/usuario');


// servicio agregar usuario

router.post('/register', async function(req,res){
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
    
    //encrypt password
    u.contrasena = await u.encryptPassword(req.body.contrasena)

    u.save().then(result=>{
        res.send({codigoResultado:1,mensaje:'registro guardado',usuarioGuardado:result});
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end(); 
    });
});

router.post('/login', function(req, res){
    var result = Result.createResult();
    usuario.findOne({ usuario: req.body.usuario }, async (error, usuario)=> {
        if(error){
            result.Error = error
            return res.json(result)
        }
        
        //bcrypt        
        let comparePass = false
        if (usuario){
            comparePass = await usuario.matchPassword({ password: req.body.contrasena, encryptPassword: usuario.contrasena })
        } 
                // usuario.contrasena != req.body.contrasena
        if (!usuario || (!comparePass)) {
            result.Error = 'Usuario o contraseña incorrecto'
            return res.json(result)
         }
        
         result.Response = 'Inicio de sesión exitoso'
         return res.json(result)
    })

})



module.exports = router;