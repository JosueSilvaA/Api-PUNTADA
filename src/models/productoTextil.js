const mongoose = require('mongoose');

const productoTextil = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    tipoTextil:{
        type:mongoose.SchemaTypes.Array,
        required:true,
        default:[]
    },
    color:{
        type:String,
        required:true,
        trim:true
    },
    rbaColor:{
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

module.exports = mongoose.model('productoTextil',productoTextil);