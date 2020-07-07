const express = require('express');
const router = express.Router();
const rol = require('../models/rol');
const Result = require('../helpers/result');
const mongoose = require('mongoose');

// Registrar un rol

router.post('/registroRol', function (req, res) {
    console.log(req.body);
    let newRol = new rol({
        nombre: req.body.nombre
    });

    let result = Result.createResult();
    newRol.save().then(response=>{
        result.Error = false;
        result.Response = 200;
        result.Items = response;
        res.send(result);
    }).catch(err=>{
        result.Error = err;
        result.Response = 500;
        result.Success = false;
        res.send(result);
    });
});

// Obtener los roles

router.get('/obtenerRoles',function(req,res){
    let result = Result.createResult();
    rol.find({}).then(response=>{
        result.Error = false;
        result.Response = 200;
        result.Items = response;
        res.send(result);
    }).catch(err=>{
        result.Error = err;
        result.Response = 500;
        result.Success = false;
        res.send(result);
    });
});

// Registrar Privilegio

router.post('/:idRol/registroPrivilegio',function(req,res){
    let result = Result.createResult();
    rol.update(
        {
            _id: mongoose.Types.ObjectId(req.params.idRol)
        },
        {
            $push:{
                privilegios:{
                    _id:mongoose.Types.ObjectId(),
                    nombre:req.body.nombre,
                    descripcion:req.body.descripcion,
                    creada: new Date()
                }
            }
        }
    ).then(response=>{
        result.Error = false;
        result.Response = 200;
        result.Items = response;
        res.send(result);
    }).catch(err=>{
        result.Error = err;
        result.Response = 500;
        result.Success = false;
        res.send(result);
    });
})



module.exports = router;