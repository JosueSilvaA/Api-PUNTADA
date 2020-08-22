const express = require('express');
const router = express.Router();
const privilegio = require('../models/privilegio');
const Result = require('../helpers/result');
const Rol = require('../models/rol');
const decodeJWT = require('../configs/decodedJWT')
const AutenticationToken = require('../middlewares/autenticationJWT');
const AutenticacionLv1 = require("../middlewares/autenticacionLvl1");

// Registrar un privilegio

router.post('/registroPrivilegio',AutenticacionLv1 ,function(req,res){
    let nuevoPrivilegio = new privilegio({
        nombre:req.body.nombre,
        descripcion:req.body.descripcion
    });

    let result = Result.createResult();
    nuevoPrivilegio.save()
    .then(response=>{
        result.Error = false
        result.Response = 'Privilegio registrado con exito'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Obtener los privilegios

router.get('/obtenerPrivilegios',AutenticationToken,function(req,res){
    let result = Result.createResult();
    privilegio.find({},{nombre:true,descripcion:true}).then(response=>{
        result.Error = false
        result.Response = 'Todos los privilegios'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});


// Privilegios que no están en un rol.

router.post('/obtenerPrivilegiosNotInRol',AutenticationToken,function(req,res){
    let result = Result.createResult();

    Rol.findOne({'nombre': req.body.rol}, {nombre:true, privilegios: true}).then(response => {
        privilegio.find({_id: {$nin: response.privilegios}}, {nombre:true, descripcion: true}).then(response=>{
            result.Error = false
            result.Response = 'Privilegios faltantes en el rol'
            result.Items = response
            res.send(result)
        })
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
   
});

// privilegios por usuario pantallas
router.get("/privilegiosUsuario", AutenticationToken, (req, res) => {
  let result = Result.createResult();

  const decodedToken = decodeJWT(req.headers["access-token"]);
  let permisos = {};

  Rol.findById({ _id: decodedToken.rol }, { nombre: true })
    .populate("privilegios")
    .then((response) => {
      response.privilegios.forEach((element) => {
        permisos[`${element.nombre}`] = true;
      });
      result.Error = false;
      result.Response = "Privilegios del rol";
      result.Items = permisos;
      res.send(result);
    })
    .catch((err) => {
      result.Error = err;
      result.Response = "Ocurrio un error";
      res.send(result);
    });
});

module.exports = router;