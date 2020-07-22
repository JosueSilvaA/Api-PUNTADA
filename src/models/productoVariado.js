const mongoose = require('mongoose');

const productoVariado = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    proveedor:{
        type:mongoose.SchemaTypes.ObjectId
    },
    marca:{
        type:String,
        required:true,
        trim:true
    },
    precio:{
        type:Number,
        required:true
    },
    cantidad:{
        type:Number,
        trim:true,
        default:1
    },
    tipoVariado:{
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
        default:true
    },
    creada:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('productoVariado',productoVariado);