const express = require('express');
const router = express.Router();
const productoEscolar = require('../models/productoEscolar');
const productoTextil = require('../models/productoTextil')
const productoVariado = require('../models/productoVariado')
const Result = require('../helpers/result');
const mongoose = require('mongoose');

router.get('/obtenerProductoPorId/:idProducto', async (req, res) => {
    /* METODO TEMPORAL */
    let result = Result.createResult();
    let data = await productoTextil.findById(req.params.idProducto)
    if (data === null) {
        data = await productoEscolar.findById(req.params.idProducto)
    } else if (data === null) {
        data = await productoVariado.findById(req.params.idProducto)
    }
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




module.exports = router;