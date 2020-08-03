const express = require('express');
const router = express.Router();
const facturaCliente = require('../models/facturaCliente');
const Result = require('../helpers/result');
const mongoose = require('mongoose')

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

router.get('/obtenerVentasEmpleado/:idEmpleado', (req, res) => {
    let result = Result.createResult();
    facturaCliente.find({ nombreEmpleado: req.params.idEmpleado},{
        nombreCliente: true,
        fechaFactura: true,
        nombreEmpleado: true,
        subTotal: true,
        isv: true,
        total: true,
        rtn: true    
    })
    .then((response) => {
        result.Error = false
        result.Response = 'Todas las facturas de clientes'
        result.Items = response
        res.send(result)
    }).catch((err) => {
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
})

module.exports = router;