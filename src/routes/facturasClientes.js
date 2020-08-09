const express = require('express');
const router = express.Router();
const facturaCliente = require('../models/facturaCliente');
const Result = require('../helpers/result');
const mongoose = require('mongoose')
const ProductoEscolar = require('../models/productoEscolar');
const ProductoTextil = require('../models/productoTextil');
const ProductoVariado = require('../models/productoVariado');

// registrar factura cliente

router.post('/registroFacturaCliente',function(req,res){
    let result = Result.createResult();
    let nuevaFactura = new facturaCliente({
        nombreCliente:req.body.data.nombreCliente,
        rtn:req.body.data.rtn,
        telefono:req.body.data.telefono,
        direccion:req.body.data.direccion,
        fechaFactura:req.body.data.fechaFactura,
        productos:req.body.productos,
        nombreEmpleado:mongoose.Types.ObjectId(req.body.idEmpleado),
        subTotal:req.body.data.subTotal,
        isv:req.body.data.isv,
        total:req.body.data.total
    })
    nuevaFactura.save().then(response =>{
        let productos = req.body.productos
        for (let i = 0; i < productos.length; i++) {
            ProductoEscolar.findById({_id:productos[i].producto})
            .then(productoEs=>{
                let cantidadActual = productoEs.cantidad
                let cantidadNueva = cantidadActual - productos[i].cantidad
                ProductoEscolar.updateOne({_id:productos[i].producto},{cantidad : cantidadNueva})
                .then(productoActualizado=>{
                    if (productoActualizado.nModified === 1 && productoActualizado.n === 1) {
                        result.Error = false
                        result.Response = 'Se cambio la cantidad del producto'
                        res.send(result)
                    } else if (productoActualizado.nModified === 0 && productoActualizado.n === 1) {
                        result.Error = false
                        result.Response = 'No se realizo ningun cambio'
                        res.send(result)
                    } else {
                        result.Error = 'Id Invalido'
                        result.Success = false
                        res.send(result)
                    }
                })
            })
            .catch(err=>{
                result.Error = err
                result.Response = 'Ocurrio un error'
                result.Success = false
                res.send(result)
            })
            /////////////////////////////////////////////////////
            ProductoTextil.findById({_id:productos[i].producto})
            .then(productoTe=>{
                let cantidadActual = productoTe.cantidad
                let cantidadNueva = cantidadActual - productos[i].cantidad
                ProductoTextil.updateOne({_id:productos[i].producto},{cantidad : cantidadNueva})
                .then(productoActualizado=>{
                    if (productoActualizado.nModified === 1 && productoActualizado.n === 1) {
                        result.Error = false
                        result.Response = 'Se cambio la cantidad del producto'
                        res.send(result)
                    } else if (productoActualizado.nModified === 0 && productoActualizado.n === 1) {
                        result.Error = false
                        result.Response = 'No se realizo ningun cambio'
                        res.send(result)
                    } else {
                        result.Error = 'Id Invalido'
                        result.Success = false
                        res.send(result)
                    }
                })
            })
            .catch(err=>{
                result.Error = err
                result.Response = 'Ocurrio un error'
                result.Success = false
                res.send(result)
            })
            ////////////////////////////////////////////////////
            ProductoVariado.findById({_id:productos[i].producto})
            .then(productoVa=>{
                let cantidadActual = productoVa.cantidad
                let cantidadNueva = cantidadActual - productos[i].cantidad
                ProductoVariado.updateOne({_id:productos[i].producto},{cantidad : cantidadNueva})
                .then(productoActualizado=>{
                    if (productoActualizado.nModified === 1 && productoActualizado.n === 1) {
                        result.Error = false
                        result.Response = 'Se cambio la cantidad del producto'
                        res.send(result)
                    } else if (productoActualizado.nModified === 0 && productoActualizado.n === 1) {
                        result.Error = false
                        result.Response = 'No se realizo ningun cambio'
                        res.send(result)
                    } else {
                        result.Error = 'Id Invalido'
                        result.Success = false
                        res.send(result)
                    }
                })
            })
            .catch(err=>{
                result.Error = err
                result.Response = 'Ocurrio un error'
                result.Success = false
                res.send(result)
            })
        }
        result.Error = false
        result.Response = 'Factura de Cliente registrada con exito'
        result.Items = response
        res.send(result)
    }).catch(err =>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});


// Obtener Facturas Clientes

router.get('/obtenerFacturasClientes',function(req,res){
    let result = Result.createResult();
    facturaCliente.find({}).then(response=>{
        result.Error = false
        result.Response = 'Todas las facturas de clientes'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
})

// Editar Factura Clientes

router.put('/:idFactura/editarFacturaCliente',function(req,res){
    let result = Result.createResult();
    facturaCliente.updateOne(
        {_id:req.params.idFactura},
        {
            nombreCliente:req.body.data.nombreCliente,
            rtn:req.body.data.rtn,
            telefono:req.body.data.telefono,
            direccion:req.body.data.direccion,
            fechaFactura:req.body.data.fechaFactura
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se modifico la informacion de la factura'
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
})

module.exports = router;