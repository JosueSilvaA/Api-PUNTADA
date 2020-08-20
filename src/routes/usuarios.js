var express = require('express')
const CreateJWT = require('../configs/jwtConfig')
const AutenticationToken = require('../middlewares/autenticationJWT')
const router = express.Router()
const Result = require('../helpers/result')
const Usuario = require('../models/usuario')
const mongoose = require('mongoose')
const Rol = require('../models/rol')
const Privilegio = require('../models/privilegio')
const cloudinary = require('../configs/Credenciales');
const fs = require("fs-extra");
const estructuraBitacora = require('../helpers/esquemaBitacora');
const decodeJWT = require('../configs/decodedJWT');


// Registrar usuario

router.post('/registroUsuario',AutenticationToken, async function(req, res) {
    let token = decodeJWT(req.headers['access-token']);
    let u = new Usuario({
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        usuario: req.body.usuario,
        direccion: req.body.direccion,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        identidad: req.body.identidad,
        telefono: req.body.telefono
    })

    //encrypt password
    u.contrasena = await u.encryptPassword(req.body.contrasena)
    let result = Result.createResult()
    u.save()
        .then(response => {
            result.Error = false
            result.Items = response
            result.Response = 'Usuario registrado exitosamente'
            res.send(result)
            estructuraBitacora(
                token.id,
                response._id,
                'Se registro un usuario',
                'Gestion Usuarios',
                'USUARIOS'
            )
        })
        .catch(err => {
            if(err.keyValue.usuario){
                result.Error = err
                result.Success = false
                result.Response = 'Este usuario ya esta registrado'
                res.send(result)
            }else if(err.keyValue.correo){
                result.Error = err
                result.Success = false
                result.Response = 'Este correo ya esta registrado'
                res.send(result)
            }else if(err.keyValue.identidad){
                result.Error = err
                result.Success = false
                result.Response = 'Este numero de identidad ya esta registrado'
                res.send(result)
            }else if(err.keyValue.telefono){
                result.Error = err
                result.Success = false
                result.Response = 'Este numero de telefono ya esta registrado'
                res.send(result)
            }else{
                result.Error = err
                result.Response = 'Ocurrio un error'
                res.send(result)
            }
        })
})

// login usuario
router.post('/login', function(req, res) {
    var result = Result.createResult()
    Usuario.findOne({ usuario: req.body.usuario }, async(error, usuario) => {
        if(!usuario.estado){
            result.Error = 'No existe este usuario'
            return res.json(result)
        }
        if (error) {
            result.Error = error
            return res.json(result)
        }

        //bcrypt
        let comparePass = false
        if (usuario) {
            comparePass = await usuario.matchPassword({
                password: req.body.contrasena,
                encryptPassword: usuario.contrasena
            })
        }
        // usuario.contrasena != req.body.contrasena
        if (!usuario || !comparePass) {
            result.Error = 'Usuario o contraseña incorrecto'
            return res.json(result)
        }
        //Create Token
        const token = await CreateJWT({
            usuario: usuario.usuario,
            id: usuario._id,
            rol: usuario.rol,
            imgUser: usuario.imgUsuario
        })
        
        result.Items = { token: token }
        result.Response = 'Inicio de sesión exitoso'
        return res.json(result)
    })
})

// Obtener usuarios por campos solicitados

router.get('/infoUsuarios', AutenticationToken, function(req, res) {
    let result = Result.createResult()
    Usuario.find({}, {
            nombres: true,
            apellidos: true,
            usuario: true,
            rol: true,
            imgUsuario: true,
            estado: true,
        })
        .populate('rol', 'nombre')
        .then(response => {
            let usuarios = response;
            let usuariosActivos = [];
            for(let i = 0; i<usuarios.length;i++){
                if(usuarios[i].estado == true){
                    usuariosActivos.push(usuarios[i]);
                }
            }
            result.Error = false
            result.Response = 'Usuarios con informacion mas importante'
            result.Items = usuariosActivos;
            res.send(result)
        })
        .catch(err => {
            console.log(err)
            result.Error = err
            result.Response = 'Ocurrio un error'
            res.send(result)
        })
})

// Obtener informacion de un empleado

router.get('/:idUsuario/obtenerUsuario',AutenticationToken,function(req,res){
    let result = Result.createResult()
    Usuario.findById(
        {_id:req.params.idUsuario},
        {
            nombres: true,
            apellidos: true,
            usuario: true,
            rol: true,
            imgUsuario: true,
            estado: true
        }
    )
    .populate('rol', 'nombre')
    .then(response =>{
        if(response === null){
            result.Error = true
            result.Response = 'Id invalido'
            res.send(result)
        }else{
            result.Error = false
            result.Response = 'Empleado Obtenido'
            result.Items = response
            res.send(result)
        }
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
})

// Cambiar estado del Usuario

router.put('/:idUsuario/cambiarEstado',AutenticationToken,function(req, res) {
    let token = decodeJWT(req.headers['access-token']);
    let result = Result.createResult()
    Usuario.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idUsuario)
        }, {
            estado: false
        })
        .then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se cambio el estado del usuario'
                res.send(result)
                estructuraBitacora(
                    token.id,
                    req.params.idUsuario,
                    'Se elimino un usuario',
                    'Gestion Usuarios',
                    'USUARIOS'
                    )
            } else if (response.nModified === 0 && response.n === 1) {
                result.Error = false
                result.Response = 'No se realizo ningun cambio'
                res.send(result)
            } else {
                result.Error = 'Id Invalido'
                result.Success = false
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            res.send(result)
        });
})

// Cambiar rol de un usuario

router.put('/:idUsuario/cambiarRol',AutenticationToken, function(req, res) {
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    Usuario.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idUsuario)
        }, {
            rol: mongoose.Types.ObjectId(req.body.rol)
        })
        .then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se cambio el rol del usuario'
                res.send(result)
                estructuraBitacora(
                    token.id,
                    req.params.idUsuario,
                    'Se modifico el rol del usuario',
                    'Gestion Usuarios',
                    'USUARIOS'
                )
            } else if (response.nModified === 0 && response.n === 1) {
                result.Error = false
                result.Response = 'No se realizo ningun cambio'
                res.send(result)
            } else {
                result.Error = 'Id Invalido'
                result.Success = false
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            res.send(result)
        });
});

// Editar Usuario

router.put('/:idUsuario/editarUsuario',AutenticationToken, function(req, res) {
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    Usuario.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idUsuario)
        }, {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            usuario: req.body.usuario,
            direccion: req.body.direccion,
            correo: req.body.correo,
            identidad: req.body.identidad,
            telefono: req.body.telefono
        })
        .then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se modifico la informacion del usuario con exito'
                res.send(result)
                estructuraBitacora(
                    token.id,
                    req.params.idUsuario,
                    'Se modifico la informacion del usuario',
                    'Gestion Usuarios',
                    'USUARIOS'
                )
            } else if (response.nModified === 0 && response.n === 1) {
                result.Error = false
                result.Response = 'No se realizo ningun cambio'
                res.send(result)
            } else {
                result.Error = 'Id Invalido'
                result.Success = false
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            res.send(result)
        });
})

router.get('/infoUsuario/:idUsuario',AutenticationToken,(req, res) => {
    let result = Result.createResult();
    Usuario.findById(req.params.idUsuario, {
      nombres: true,
      apellidos: true,
      usuario: true,
      rol: true,
      imgUsuario: true,
      estado: true,
    })
      .populate("rol", "nombre")
      .then((response) => {
        result.Error = false;
        result.Response = "Información de usuario";
        result.Items = response;
        res.send(result);
      })
      .catch((err) => {
        result.Error = true;
        result.Response = "Error al conectar a la base de datos";
        result.Success = false;
        res.send(result);
      });
})

/* Servicio: Obtener Rol y Privilegios de un usuario */
router.get('/obtenerRolPrivilegios/:idRol',AutenticationToken, async (req, res) => {
    let result = Result.createResult();
    let rol;
    let privilegioId = [];
    Rol.findById({_id: req.params.idRol}, (err, response) => {
        if (!err) {
            rol = {nombre: response.nombre, descripcion: response.descripcion}
            response.privilegios.forEach((elemento) => {
                privilegioId.push(elemento._id)
            })
            Privilegio.find({_id: {$in: privilegioId}}, (err, response) => {
                if (!err) {
                    result.Error = false
                    result.Response = 'Info y privilegios de un rol'
                    result.Items = { rol: rol, privilegios: response }
                    res.send(result)
                } else {
                    result.Error = true
                    result.Response = 'Error: privilegios no encontrados'
                    result.Success = false
                    res.send(result)
                }
                
            })
        } else {
            result.Error = true
            result.Response = 'Error, rol no encontrado'
            result.Success = false
            res.send(result)
        }
    })
})

// Obtener rol de un usuario

router.get('/obtenerRol/:idRol',AutenticationToken,function(req,res){
    let result = Result.createResult();
    Rol.findById({_id:req.params.idRol},{nombre:true})
    .then(response=>{
        result.Error = false
        result.Response = 'Rol del Usuario'
        result.Items = response
        res.send(result)
    })
    .catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        res.send(result)
    })
})

/* Cambiar imagen de usuario */

router.post("/cambiarImagenUsuario/:idUsuario", AutenticationToken, async (req, res) => {
  let file = req.file;
  let result = Result.createResult();
  let id_publica = req.params.idUsuario;
  let token = decodeJWT(req.headers['access-token']);
  const borrarAnt = await cloudinary.uploader.destroy("usuarios/" + id_publica);

  if (borrarAnt.error === undefined) {
    const resultCloud = await cloudinary.uploader.upload(file.path, {
      public_id: id_publica,
      folder: "usuarios",
      user_filename: true,
    });
    fs.unlink(file.path);
    Usuario.updateOne(
      {
        _id: mongoose.Types.ObjectId(id_publica),
      },
      {
        imgUsuario: resultCloud.secure_url,
      }
    )
      .then((response) => {
        if (response.nModified === 1 && response.n === 1) {
          result.Error = false;
          result.Response = "Se cambio la imagen del usuario";
          res.send(result);
          estructuraBitacora(
            token.id,
            req.params.idUsuario,
            'Se modifico la imagen de perfil del usuario',
            'Gestion Usuarios',
            'USUARIOS'
        )
        } else if (response.nModified === 0 && response.n === 1) {
          result.Error = false;
          result.Response = "No se realizo ningun cambio";
          res.send(result);
        } else {
          result.Error = "Id Invalido";
          result.Success = false;
          res.send(result);
        }
      })
      .catch((err) => {
        result.Error = err;
        result.Response = "Ocurrio un error";
        res.send(result);
      });
  } else {
    result.Error = true;
    result.Response = "Ocurrio un error";
    res.send(result);
  }
});

module.exports = router