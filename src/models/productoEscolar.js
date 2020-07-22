const mongoose = require('mongoose');

const productoEscolar = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
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
    color:{
        type:String,
        trim:true,
        default:''
    },
    imgProducto:{
        type:String,
        trim:true,
        default:'https://rockcontent.com/es/wp-content/uploads/2019/02/ejemplos-de-merchandising-1280x720.png'
    },
    precio:{
        type:Number,
        required:true,
        trim:true
    },
    cantidad:{
        type:Number,
        trim:true,
        default:1
    },
    tipoUtil:{
        type:String,
        required:true
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