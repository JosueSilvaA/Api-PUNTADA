const mongoose = require('mongoose');

const productoEscolar = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    marca:{
        type:String,
        required:true,
        trim:true
    },
    proveedor:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    precio:{
        type:mongoose.SchemaTypes.Decimal128,
        required:true,
        trim:true
    },
    tipoUtil:{
        type:String,
        required:true,
        trim:true
    },
    descripcion:{
        type:String,
        required:true
    },
    estado:{
        type:mongoose.SchemaTypes.Boolean,
        required:true,
        default:true
    },
    creada:{ 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('productosEscolares',productoEscolar);