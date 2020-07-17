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

router.get('/obtenerProductosEscolares',function(req,res){
    let result = Result.createResult();
    productoEscolar.find({}).then(response=>{
        result.Error = false
        result.Response = 'Todos los productos escolares'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Editar producto escolar

router.put('/:idProducto/editarProductoEscolar',function(req,res){
    let result = Result.createResult();
    productoEscolar.updateOne(
        {_id:req.params.idProducto},
        {
            nombre:req.body.nombre,
            marca:req.body.marca,
            color:req.body.color,
            precio:req.body.precio,
            tipoUtil:req.body.tipoUtil,
            descripcion:req.body.descripcion
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se modifico la informacion del producto'
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

// Eliminar producto escolar

router.put('/:idProducto/eliminarProductoEscolar',function(req,res){
    let result = Result.createResult();
    productoEscolar.updateOne(
        {_id:req.params.idProducto},
        {
            estado:false
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se elimino el producto con exito'
                res.send(result)
            }else{
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

module.exports = router;