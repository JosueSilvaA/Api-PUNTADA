const express = require('express');
const router = express.Router();
const productoEscolar = require('../models/productoEscolar');
const Result = require('../helpers/result');

// registrar un producto escolares

router.post('/registroProductoEscolar',function(req,res){
    let result = Result.createResult();
    
});