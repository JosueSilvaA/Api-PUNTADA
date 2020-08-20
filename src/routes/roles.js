const express = require('express')
const router = express.Router()
const rol = require('../models/rol')
const privilegio = require('../models/privilegio');
const Result = require('../helpers/result')
const mongoose = require('mongoose')
const AutenticationToken = require('../middlewares/autenticationJWT');
const { populate } = require('../models/rol');

// Registrar un rol

router.post('/registroRol',AutenticationToken, function(req, res) {
    let newRol = new rol({
        nombre: req.body.nombre,
        descripcion:req.body.descripcion
    })

    let result = Result.createResult()
    newRol
        .save()
        .then(response => {
            result.Error = false
            result.Response = 'Rol registrado con exito'
            result.Items = response
            res.send(result)
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result)
        })
})

// Obtener los roles

router.get('/obtenerRoles',AutenticationToken, function(req, res) {
        let result = Result.createResult()
        rol
            .find({})
            .populate('privilegios', 'nombre')
            .then(response => {
                result.Error = false
                result.Response = 'Todos los roles'
                result.Items = response
                res.send(result)
            })
            .catch(err => {
                result.Error = err
                result.Response = 'Ocurrio un error'
                result.Success = false
                res.send(result)
            })
    })
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Agregar un Privilegio a un Rol */

router.post('/:idRol/privilegio/:idPrivilegio/registroPrivilegio',AutenticationToken, function(req, res) {
    let result = Result.createResult()
    rol
        .updateOne({
            _id: mongoose.Types.ObjectId(req.params.idRol)
        }, {
            $push: {
                privilegios: {
                    _id: mongoose.Types.ObjectId(req.params.idPrivilegio)
                }
            }
        })
        .then(response => {
            if(response.nModified === 1 && response.n === 1){
                result.Success = true;
                result.Error = false;
                result.Response = 'Privilegio registrado con exito';
                res.send(result);
            }else if(response.nModified === 0 && response.n === 1){
                result.Error = false
                result.Response = 'No se realizo ningun cambio'
                res.send(result)
            }else{
                result.Error = 'Id Invalido'
                result.Success = false
                result.Items = [];
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result)
        });
});

// Obtener privilegios de un rol

router.post('/:idRol/obtenerPrivilegios', AutenticationToken,function(req, res) {
    let result = Result.createResult()
    rol
        .find({
            _id: mongoose.Types.ObjectId(req.params.idRol)
        }, {
            privilegios: true
        })
        .then(response => {
            if(response.length == 0){
                result.Error = 'Id Invalido'
                result.Success = false
                result.Items = [];
                res.send(result)
            }else{
                privilegio.find({_id: {$in: response[0].privilegios}}, {nombre:true, descripcion: true}).then(response => {
                    result.Success = true;
                    result.Error = false
                    result.Response = 'Todos los privilegios de este rol'
                    result.Items = response
                    res.send(result)
                })
                //console.log(response[0].privilegios)
               
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result);
        })
})

// Eliminar privilegio de un rol

router.delete('/:idRol/privilegios/:idPrivilegio/eliminarPrivilegio',AutenticationToken, function(req, res) {
    let result = Result.createResult();
    rol.update({
            _id: mongoose.Types.ObjectId(req.params.idRol)
        }, {
            $pull: {
                privilegios: {
                    _id: mongoose.Types.ObjectId(req.params.idPrivilegio)
                }
            }
        })
        .then(response => {
            if(response.nModified === 1 && response.n === 1){
                result.Error = false
                result.Response = 'Privilegio eliminado con exito'
                result.Items = response[0]
                res.send(result)
            }else{
                result.Error = 'Id Invalido'
                result.Success = false
                result.Items = [];
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result)
        });
});

/* Registrar un privilegio */
router.post(
  "/registroPrivilegio",
  AutenticationToken,
   (req, res) => {
       let result = Result.createResult();
      let newPrivilegio = new privilegio({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
      });

      newPrivilegio
        .save()
        .then((response) => {
          result.Error = false;
          result.Response = "Privilegio registrado con exito";
          result.Items = response;
          res.send(result);
        })
        .catch((err) => {
          result.Error = err;
          result.Response = "Ocurrio un error";
          result.Success = false;
          res.send(result);
        });
  }
);


module.exports = router