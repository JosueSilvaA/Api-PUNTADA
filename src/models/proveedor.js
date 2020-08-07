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
        type:String,
        trim:true,
        required:true
    },
    imgProveedor:{
        type:String,
        trim:true,
        default:'https://www.comologia.com/wp-content/uploads/2018/03/mejores-proveedores-mayoristas-distribuidores-confiables.jpg'
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

module.exports = mongoose.model('proveedores',proveedor);