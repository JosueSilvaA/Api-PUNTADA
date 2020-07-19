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
        descripcion:req.body.descripcion,
        tipoTextil:req.body.tipoTextil
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

// obtener todos los productos textiles

router.get('/obtenerProductosTextiles',function(req,res){
    let result = Result.createResult();
    productoTextil.find({}).then(response=>{
        let productosActivos = [];
        for(let i = 0; i < response.length;i++){
            if(response[i].estado == true){
                 productosActivos.push(response[i]);
            }
        }
        result.Error = false
        result.Response = 'Todos los productos textiles'
        result.Items = productosActivos
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

module.exports = router;