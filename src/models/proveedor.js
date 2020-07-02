const mongoose = require('mongoose');

const proveedor = new mongoose.Schema({
    nombre:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    rtn:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    telefono:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    direccion:{
        type:String,
        trim:true,
        required:true
    },
    tipoProducto:{
        type:mongoose.SchemaTypes.Array,
        trim:true,
        required:true
    },
    estado:{
        type:mongoose.SchemaTypes.Boolean,
        trim:true,
        default:true
    },
    creado: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('proveedor',proveedor);