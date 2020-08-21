const express = require('express');
const router = express.Router();
const productoEscolar = require('../models/productoEscolar');
const productoTextil = require('../models/productoTextil')
const productoVariado = require('../models/productoVariado')
const Result = require('../helpers/result');
const mongoose = require('mongoose');
const AutenticationToken = require('../middlewares/autenticationJWT')

router.get('/obtenerProductoPorId/:idProducto',AutenticationToken, async (req, res) => {
    let result = Result.createResult();
    let data;
   await productoEscolar.findById(req.params.idProducto)
    .populate('proveedor', 'nombre')
    .then(async (resEscolar) => {
        data = resEscolar;
        if (data === null || data === undefined) {
            await productoTextil.findById(req.params.idProducto)
            .populate('proveedor', 'nombre')
            .then( async (resTextil) => {
                data = resTextil;
                if (data === null || data === undefined) {
                    await productoVariado.findById(req.params.idProducto)
                    .populate('proveedor', 'nombre')
                    .then((resVariado) => {
                        data = resVariado;
                    })
                }
            })      
        }
    })
    
    if (data !== null) {
        result.Error = false
        result.Response = 'Productos generales'
        result.Items = data
    } else {
        result.Error = true
        result.Response = 'No se ha encontrado el producto'
        result.Success = false
    }
    res.send(result)
});

/* Servicio temporal, mejorar luego */
router.get('/obtenerProductos',AutenticationToken, async (req, res) => {
    let result = Result.createResult();

    let productos = [];
    const escolar = await productoEscolar.find({})
    const textil = await productoTextil.find({})
    const variado = await productoVariado.find({})
    escolar.forEach((producto) =>{
        productos.push(producto)
    })
    textil.forEach((producto) => {
        productos.push(producto)
    })
    variado.forEach((producto) => {
        productos.push(producto)
    })
    result.Error = false
    result.Response = 'Productos generales'
    result.Items = productos
    res.send(result)

})




module.exports = router;