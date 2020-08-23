const express = require('express');
const router = express.Router();
const facturaProveedor = require('../models/facturaProveedor');
const ProductoEscolar = require('../models/productoEscolar');
const ProductoTextil = require('../models/productoTextil');
const ProductoVariado = require('../models/productoVariado');
const Result = require('../helpers/result');
const mongoose = require('mongoose');
const AutenticationToken = require('../middlewares/autenticationJWT')
const estructuraBitacora = require('../helpers/esquemaBitacora');
const decodeJWT = require('../configs/decodedJWT');
const AutenticacionLv1 = require("../middlewares/autenticacionLvl1");
const AutenticacionLv2 = require("../middlewares/autenticacionLvl2");
const AutenticacionLv3 = require("../middlewares/autenticacionLvl3");

// registrar factura proveedor

router.post('/registroFacturaProveedor',AutenticacionLv2 ,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    let nuevaFactura = new facturaProveedor({
        proveedor:mongoose.Types.ObjectId(req.body.idProveedor),
        fechaFactura:req.body.data.fechaFactura,
        productos:req.body.productos,
        subTotal:req.body.data.subTotal,
        isv:req.body.data.isv,
        total:req.body.data.total,
        estado:req.body.data.estado
    })
    nuevaFactura.save().then(response =>{
        let productos = req.body.productos
        for (let i = 0; i < productos.length; i++) {
            ProductoEscolar.findById({_id:productos[i].producto})
            .then(productoEs=>{
                let cantidadActual = productoEs.cantidad
                let cantidadNueva = cantidadActual + productos[i].cantidad
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
                let cantidadNueva = cantidadActual + productos[i].cantidad
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
                let cantidadNueva = cantidadActual + productos[i].cantidad
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
        result.Response = 'Factura de Proveedor registrada con exito'
        result.Items = response
        res.send(result)
        estructuraBitacora(
            token.id,
            response._id,
            'Se registro una factura',
            'Gestion Facturas de Proveedores',
            'FACTURAS PROVEEDORES'
        )
        sendAdminNotification(
          "La Puntada",
          `El usuario ${req.decoded.user} registró una nueva factura de proveedor.`
        );
    }).catch(err =>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});


// Obtener Facturas Proveedor

router.get('/obtenerFacturasProveedores',AutenticationToken,function(req,res){
    let result = Result.createResult();
    facturaProveedor.find({})
    .populate('proveedor', 'nombre')
    .then(response=>{
        result.Error = false
        result.Response = 'Todas las facturas de proveedores'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
})

router.get('/obtenerFacturaProveedor/:idFactura',AutenticationToken,function(req,res){
    let result = Result.createResult();
    facturaProveedor.find({_id:req.params.idFactura})
    .populate('proveedor', 'nombre')
    .then(response=>{
        result.Error = false
        result.Response = 'Factura de Proveedor'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
})

// Editar Factura Proveedor

router.put('/:idFactura/editarFacturaProveedor',AutenticacionLv1 ,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    facturaProveedor.updateOne(
        {_id:req.params.idFactura},
        {
            proveedor:mongoose.Types.ObjectId(req.body.data.idProveedor),
            fechaFactura:req.body.data.fechaFactura
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se modifico la informacion de la factura'
                res.send(result)
                estructuraBitacora(
                    token.id,
                    req.params.idFactura,
                    'Se edito una factura',
                    'Gestion Facturas de Proveedores',
                    'FACTURAS PROVEEDORES'
                )
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