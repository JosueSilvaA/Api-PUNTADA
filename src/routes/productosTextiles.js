const express = require('express');
const router = express.Router();
const productoTextil = require('../models/productoTextil');
const Result = require('../helpers/result');
const mongoose = require('mongoose');


// registrar un producto textil

router.post('/registroProducto',function(req,res){
    let result = Result.createResult();
    let nuevoProducto = new productoTextil({
        nombre:req.body.nombre,
        color:req.body.color,
        rbaColor:req.body.rbaColor,
        proveedor:mongoose.Types.ObjectId(req.body.proveedor),
        precio:req.body.precio,
        descripcion:req.body.descripcion
    });
    nuevoProducto.save().then(response=>{
        result.Error = false
        result.Response = 'Producto Textil registrado con exito'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});