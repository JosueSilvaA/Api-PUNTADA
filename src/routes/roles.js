const express = require('express')
const router = express.Router()
const rol = require('../models/rol')
const Result = require('../helpers/result')
const mongoose = require('mongoose')
const { response } = require('express')

// Registrar un rol

router.post('/registroRol', function(req, res) {
    console.log(req.body)
    let newRol = new rol({
        nombre: req.body.nombre
    })

    let result = Result.createResult()
    newRol
        .save()
        .then(response => {
            result.Error = false
            result.Response = 'Rol registrado con exito'
            result.Items = response
            res.send(result)
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result)
        })
})

// Obtener los roles

router.get('/obtenerRoles', function(req, res) {
        let result = Result.createResult()
        rol
            .find({}, { nombre: true })
            .then(response => {
                result.Error = false
                result.Response = 'Todos los roles'
                result.Items = response
                res.send(result)
            })
            .catch(err => {
                result.Error = err
                result.Response = 'Ocurrio un error'
                result.Success = false
                res.send(result)
            })
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Registrar Privilegio

router.post('/:idRol/registroPrivilegio', function(req, res) {
    let result = Result.createResult()
    rol
        .update({
            _id: mongoose.Types.ObjectId(req.params.idRol)
        }, {
            $push: {
                privilegios: {
                    _id: mongoose.Types.ObjectId(),
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    creada: new Date()
                }
            }
        })
        .then(response => {
            if(response.nModified === 1 && response.n === 1){
                result.Success = true;
                result.Error = false;
                result.Response = 'Privilegio registrado con exito';
                res.send(result);
            }else{
                result.Error = 'Id Invalido'
                result.Success = false
                result.Items = [];
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result)
        })
})

// Obtener privilegios de un rol

router.get('/:idRol/obtenerPrivilegios', function(req, res) {
    let result = Result.createResult()
    rol
        .find({
            _id: mongoose.Types.ObjectId(req.params.idRol)
        }, {
            privilegios: true
        })
        .then(response => {
            console.log(response)
            if(response.length == 0){
                result.Error = 'Id Invalido'
                result.Success = false
                result.Items = [];
                res.send(result)
            }else{
                result.Success = true;
                result.Error = false
                result.Response = 'Todos los privilegios de este rol'
                result.Items = response[0]
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result);
        })
})


// Eliminar privilegio de un rol

router.delete('/:idRol/privilegios/:idPrivilegio/eliminarPrivilegio', function(req, res) {
    let result = Result.createResult();
    rol.update({
            _id: mongoose.Types.ObjectId(req.params.idRol)
        }, {
            $pull: {
                privilegios: {
                    _id: mongoose.Types.ObjectId(req.params.idPrivilegio)
                }
            }
        })
        .then(response => {
            if(response.nModified === 1 && response.n === 1){
                result.Error = false
                result.Response = 'Privilegio eliminado con exito'
                result.Items = response[0]
                res.send(result)
            }else{
                result.Error = 'Id Invalido'
                result.Success = false
                result.Items = [];
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            result.Success = false
            res.send(result)
        });
});

// Editar un privilegio

router.put('/:idRol/privilegios/:idPrivilegio/editarPrivilegio',function(req,res){
    let result = Result.createResult();
    rol.update(
        {
            _id: mongoose.Types.ObjectId(req.params.idRol),
            "privilegios._id":mongoose.Types.ObjectId(req.params.idPrivilegio)
        },
        {
            $set:
            {
                "privilegios.$.nombre":req.body.nombre,
                "privilegios.$.descripcion":req.body.descripcion
            }
        }
    )
    .then(response=>{
        if(response.nModified === 1 && response.n === 1){
            result.Error = false
            result.Response = 'Privilegio editado con exito'
            res.send(result)
        }else{
            result.Error = 'Id Invalido'
            result.Success = false
            result.Items = [];
            res.send(result)
        }
    })
    .catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

module.exports = router