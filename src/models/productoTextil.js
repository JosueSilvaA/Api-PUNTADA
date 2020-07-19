const mongoose = require('mongoose');

const productoTextil = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    tipoTextil:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true,
        trim:true
    },
    imgProducto:{
        type:String,
        trim:true,
        default:'https://rockcontent.com/es/wp-content/uploads/2019/02/ejemplos-de-merchandising-1280x720.png'
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
        type:Number,
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