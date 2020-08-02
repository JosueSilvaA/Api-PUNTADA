var express = require('express')
const CreateJWT = require('../configs/jwtConfig')
const AutenticationToken = require('../middlewares/autenticationJWT')
const router = express.Router()
const Result = require('../helpers/result')
const Usuario = require('../models/usuario')
const mongoose = require('mongoose')
const Rol = require('../models/rol')
const Privilegio = require('../models/privilegio')
const { route } = require('../middlewares/autenticationJWT')


//prueba para usar autenticación con jwt
router.post('/prueba', AutenticationToken, (req, res) => {
    res.send('hi')
})

// Registrar usuario

router.post('/registroUsuario', async function(req, res) {
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
            result.Response = 'Usuario registrado con exito'
            res.send(result)
            console.log(response)
        })
        .catch(err => {
            if(err.keyValue.usuario){
                result.Error = 'Este usuario ya esta registrado'
                result.Success = false
                result.Response = 'Ocurrio un error'
                res.send(result)
            }else if(err.keyValue.correo){
                result.Error = 'Este correo ya esta registrado'
                result.Success = false
                result.Response = 'Ocurrio un error'
                res.send(result)
            }else if(err.keyValue.identidad){
                result.Error = 'Este numero de identidad ya esta registrado'
                result.Success = false
                result.Response = 'Ocurrio un error'
                res.send(result)
            }else if(err.keyValue.telefono){
                result.Error = 'Este numero de telefono ya esta registrado'
                result.Success = false
                result.Response = 'Ocurrio un error'
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

router.get('/infoUsuarios', function(req, res) {
    let result = Result.createResult()
    Usuario.find({}, {
            nombres: true,
            apellidos: true,
            usuario: true,
            rol: true,
            imgUsuario: true,
            estado: true,
        })
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
            result.Error = err
            result.Response = 'Ocurrio un error'
            res.send(result)
        })
})

// Obtener informacion de un empleado

router.get('/:idUsuario/obtenerUsuario',function(req,res){
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
    ).then(response =>{
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

router.put('/:idUsuario/cambiarEstado', function(req, res) {
    let result = Result.createResult()
    Usuario.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idUsuario)
        }, {
            estado: req.body.estado
        })
        .then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se cambio el estado del usuario'
                res.send(result)
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

router.put('/:idUsuario/cambiarRol', function(req, res) {
    let result = Result.createResult();
    Usuario.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idUsuario)
        }, {
            rol: mongoose.Types.ObjectId(req.body.rol)
        })
        .then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se cambio el estado del usuario'
                res.send(result)
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

router.put('/:idUsuario/editarUsuario', function(req, res) {
    let result = Result.createResult();
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

router.get('/infoUsuario/:idUsuario', (req, res) => {
    let result = Result.createResult();
    Usuario.findById(req.params.idUsuario, {
        nombres: true,
        apellidos: true,
        usuario: true,
        rol: true,
        imgUsuario: true,
        estado: true,
        conexiones: true
        })
        .then((response) => {
            result.Error = false
            result.Response = 'Información de usuario'
            result.Items = response
            res.send(result)
        })
        .catch((err) => {
            result.Error = true
            result.Response = 'Error al conectar a la base de datos'
            result.Success = false
            res.send(result)
        })
})

/* Servicio: Obtener Rol y Privilegios de un usuario */
router.get('/obtenerRolPrivilegios/:idRol', async (req, res) => {
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

module.exports = router