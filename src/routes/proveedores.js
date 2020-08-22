const express = require('express');
const router = express.Router();
const AutenticationToken = require('../middlewares/autenticationJWT')
const proveedor = require('../models/proveedor');
const Result = require('../helpers/result');
const estructuraBitacora = require('../helpers/esquemaBitacora');
const decodeJWT = require('../configs/decodedJWT');
const AutenticacionLv2 = require("../middlewares/autenticacionLvl2");
const AutenticacionLv1 = require('../middlewares/autenticacionLvl1');

// Registro Proveedor

router.post('/registroProveedor',AutenticacionLv2,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    let nuevoProveedor = new proveedor({
        nombre:req.body.nombre,
        rtn:req.body.rtn,
        telefono:req.body.telefono,
        direccion:req.body.direccion,
        tipoProducto:req.body.tipoProducto
    });
    nuevoProveedor.save().then(response =>{
        result.Error = false
        result.Response = 'Proveedor registrado con exito'
        result.Items = response
        res.send(result)
        estructuraBitacora(
            token.id,
            response._id,
            'Se registro un proveedor',
            'Gestion Proveedores',
            'PROVEEDORES'
          )
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Obtener Proveedores

router.get('/obtenerProveedores',AutenticationToken,function(req,res){
    let result = Result.createResult();
    proveedor.find({}).then(response =>{
            let proveedoresActivos = [];
            for(let i = 0; i<response.length;i++){
                if(response[i].estado == true){
                    proveedoresActivos.push(response[i]);
                }
            }
            result.Error = false
            result.Response = 'Todos los preveedores'
            result.Items = proveedoresActivos;
            res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Obtener Proveedor 

router.get('/:idProveedor/obtenerProveedor',AutenticationToken,function(req,res){
    let result = Result.createResult();
    proveedor.findById(
        {_id: req.params.idProveedor},
        {nombre:true}
    ).then(response =>{
        if(response === null){
            result.Error = true
            result.Response = 'Id invalido'
            res.send(result)
        }else{
            result.Error = false
            result.Response = 'Proveedor Obtenido'
            result.Items = response
            res.send(result)
        }
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});


// Editar Proveedor

router.put('/:idProveedor/editarProveedor',AutenticacionLv2,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    proveedor.updateOne(
        {_id:req.params.idProveedor},
        {
            nombre:req.body.nombre,
            rtn:req.body.rtn,
            telefono:req.body.telefono,
            direccion:req.body.direccion,
            tipoProducto:req.body.tipoProducto
        }
    ).then(response =>{
        if (response.nModified === 1 && response.n === 1) {
            result.Error = false
            result.Response = 'Se edito el proveedor con exito'
            res.send(result)
            estructuraBitacora(
                token.id,
                req.params.idProveedor,
                'Se edito un proveedor',
                'Gestion Proveedores',
                'PROVEEDORES'
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
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});

// cambiar el estado de un proveedor

router.put('/:idProveedor/eliminarProveedor',AutenticacionLv1,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    proveedor.updateOne(
        {_id:req.params.idProveedor},
        {
            estado:false
        }
    ).then(response =>{
        if (response.nModified === 1 && response.n === 1) {
            result.Error = false
            result.Response = 'Se elimino el proveedor'
            res.send(result)
            estructuraBitacora(
                token.id,
                req.params.idProveedor,
                'Se elimino un proveedor',
                'Gestion Proveedores',
                'PROVEEDORES'
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
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});


module.exports = router;