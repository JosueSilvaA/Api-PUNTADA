const express = require('express')
const AutenticationToken = require('../middlewares/autenticationJWT')
const router = express.Router()
const Result = require('../helpers/result')
const bitacora = require('../models/bitacora')

// obtener bitacora general

router.get('/obtenerBitacoraGeneral',AutenticationToken,function(req,res){
    let result = Result.createResult();
    bitacora.find({})
    .populate('usuario', 'usuario')
    .then(response=>{
        result.Error = false
        result.Response = 'Bitacora General'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
})

// obtener bitacora por empleado

router.get('/obtenerBitacoraEmpleado/:idUsuario',AutenticationToken,function(req,res){
    let result = Result.createResult();
    bitacora.findById({_id:req.params.idUsuario})
    .then(response=>{
        result.Error = false
        result.Response = 'Bitacora por empleado'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
})


module.exports = router;