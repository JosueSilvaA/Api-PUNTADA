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

// Editar producto textil

router.put('/:idProducto/editarProductoTextil',function(req,res){
    let result = Result.createResult();
    productoTextil.updateOne(
        {_id:req.params.idProducto},
        {
            nombre:req.body.nombre,
            color:req.body.color,
            precio:req.body.precio,
            tipoTextil:req.body.tipoTextil,
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

// Editar Imagen del producto

router.put('/:idProducto/editarImagen',function(req,res){
    let result = Result.createResult();
    productoVariado.updateOne(
        {_id:req.params.idProducto},
        {
            imgProducto:req.body.imgProducto
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se modifico la imagen del producto'
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


// Eliminar producto textil

router.put('/:idProducto/eliminarProductoTextil',function(req,res){
    let result = Result.createResult();
    productoTextil.updateOne(
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