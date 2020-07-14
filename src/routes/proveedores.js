const express = require('express');
const router = express.Router();
const proveedor = require('../models/proveedor');
const Result = require('../helpers/result');

// Registro Proveedor

router.post('/registroProveedor',function(req,res){
    let result = Result.createResult();
    let nuevoProveedor = new proveedor({
        nombre:req.body.nombre,
        rtn:req.body.rtn,
        telefono:req.body.telefono,
        direccion:req.body.direccion
    });
    nuevoProveedor.save().then(response =>{
        result.Error = false
        result.Response = 'Proveedor registrado con exito'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});


module.exports = router;