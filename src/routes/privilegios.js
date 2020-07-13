const express = require('express');
const router = express.Router();
const privilegio = require('../models/privilegio');
const Result = require('../helpers/result');
const { model } = require('../models/privilegio');



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

//////////////////////////////////////////////////////////////////////

module.exports = router;