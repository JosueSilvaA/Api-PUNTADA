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
        default:'https://datanetconsultores.es/wp-content/uploads/2017/09/Textil-SUBIR.jpg'
    },
    rbaColor:{
        type:String,
        required:true,
        trim:true
    },
    proveedor:{
        type:mongoose.SchemaTypes.ObjectId,
        ref: 'proveedores',
        required:true
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

module.exports = mongoose.model('productosTextiles',productoTextil);