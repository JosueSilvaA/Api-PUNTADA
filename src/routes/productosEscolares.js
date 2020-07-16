const express = require('express');
const router = express.Router();
const productoEscolar = require('../models/productoEscolar');
const Result = require('../helpers/result');
const mongoose = require('mongoose');

// registrar un producto escolares

router.post('/registroProducto',function(req,res){
    let result = Result.createResult();
    let nuevoProducto = new productoEscolar({
        nombre:req.body.nombre,
        marca:req.body.marca,
        color:req.body.color,
        proveedor:mongoose.Types.ObjectId(req.body.proveedor),
        precio:req.body.precio,
        tipoUtil:req.body.tipoUtil,
        descripcion:req.body.descripcion
    });
    nuevoProducto.save().then(response=>{
        result.Error = false
        result.Response = 'Producto Escolar registrado con exito'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});

// Obtener Producto Escolar



module.exports = router;