const express = require('express');
const router = express.Router();
const privilegio = require('../models/privilegio');
const Result = require('../helpers/result');
const rol = require('../models/rol');
const { response } = require('express');




// Registrar un privilegio

router.post('/registroPrivilegio',function(req,res){
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

router.get('/obtenerPrivilegios',function(req,res){
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

router.get('/obtenerPrivilegiosNotInRol',function(req,res){
    let result = Result.createResult();

    rol.findOne({'nombre': req.body.rol}, {nombre:true, privilegios: true}).then(response => {
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


//////////////////////////////////////////////////////////////////////

module.exports = router;