var express = require('express');
const CreateJWT = require('../configs/jwtConfig')
const AutenticationToken = require('../middlewares/autenticationJWT')
const router = express.Router();
const Result = require('../helpers/result');
const Usuario = require('../models/usuario');
const { response } = require('express');
const { Mongoose } = require('mongoose');

//prueba para usar autenticación con jwt
router.post('/prueba', AutenticationToken, (req, res) => {
    res.send('hi')
})


// servicio agregar usuario

router.post('/registroUsuario', async function(req,res){
    let u = new Usuario (
        {
            nombres:req.body.nombres,
            apellido:req.body.apellido,
            usuario:req.body.usuario,
            direccion:req.body.direccion,
            correo:req.body.correo,
            contrasena:req.body.contrasena,
            identidad:req.body.identidad,
            telefono:req.body.telefono,
            estado:req.body.estado,
            conexiones:[]
        }
    );
    
    //encrypt password
    u.contrasena = await u.encryptPassword(req.body.contrasena)
    let result = Result.createResult();

    u.save().then(response =>{
        result.Error = false;
        result.Items = response;
        result.Response = 200;
        res.send(result);
    }).catch(error=>{
        result.Error = error;
        result.Success = false;
        res.send(result);
    });
});

// lOGIN USUARIO
router.post('/login', function(req, res){
    var result = Result.createResult();
    Usuario.findOne({ usuario: req.body.usuario }, async (error, usuario)=> {
        if(error){
            result.Error = error;
            return res.json(result);
        }
        
        //bcrypt        
        let comparePass = false
        if (usuario){
            comparePass = await usuario.matchPassword({ password: req.body.contrasena, encryptPassword: usuario.contrasena })
        } 
                // usuario.contrasena != req.body.contrasena
        if (!usuario || (!comparePass)) {
            result.Error = 'Usuario o contraseña incorrecto'
            return res.json(result);
         }
        //Create Token
        const token = await CreateJWT({
            usuario: usuario.usuario,
            id: usuario._id,
            rol: usuario.rol
        });

        result.Items = {token: token}
        result.Response = 'Inicio de sesión exitoso'
        return res.json(result);
    })

})


// OBTENER USUARIOS

router.get('/obtenerUsuarios',function (req,res){
    let result = Result.createResult();
    Usuario.find({}).then(response=>{
        result.Error = false;
        result.Response = 200;
        result.Items = response;
        res.send(result);
    }).catch(err=>{
        result.Error = err;
        result.Response = 500;
        res.send(result);
    });
});

// Obtener Usuarios Por campos solicitados

router.get('/infoUsuarios',function (req,res){
    let result = Result.createResult();
    Usuario.find({},{nombres:true,apellido:true,rol:true,conexiones:true}).then(response=>{
        result.Error = false;
        result.Response = 200;
        result.Items = response;
        res.send(result);
    }).catch(err=>{
        result.Error = err;
        result.Response = 500;
        res.send(result);
    });
});

module.exports = router;