const express = require('express');
const router = express.Router();
const productoVariado = require('../models/productoVariado');
const Result = require('../helpers/result');
const mongoose = require('mongoose');

// registrar un producto variado

router.post('/registroProducto',function(req,res){
    let result = Result.createResult();
    let nuevoProducto = new productoVariado({
        nombre:req.body.nombre,
        proveedor:mongoose.Types.ObjectId(req.body.proveedor),
        precio:req.body.precio,
        tipoVariado:req.body.tipoVariado,
        descripcion:req.body.descripcion
    });
    nuevoProducto.save().then(response=>{
        result.Error = false
        result.Response = 'Producto Variado registrado con exito'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});

module.exports = router;