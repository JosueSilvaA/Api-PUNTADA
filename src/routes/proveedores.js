const express = require('express');
const router = express.Router();
const Result = require('../helpers/result');
const Usuario = require('../models/usuario')
const Proveedor = require('../models/proveedor')

router.get('/proveedores', async (req, res) => {
    let result = Result.createResult();

    Proveedor.find({}, (err, docs) => {
        if ( err ) {
            result.Error = err;
        } else {
            result.Items = docs
        }
        res.send(result)
    })
})
module.exports = router;