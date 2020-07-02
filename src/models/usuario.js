const mongoose = require('mongoose');

const usuario = new mongoose.Schema({
    nombres:{
        type:String,
        required:true,
        trim:true
    },
    apellido:{
        type:String,
        required:true,
        trim:true
    },
    usuario:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    direccion:{
        type:String,
        required:true,
        trim:true
    },
    correo:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    contrasena:{
        type:String,
        required:true,
        trim:true
    },
    rol:{
        type:Number,
        required:true,
        trim:true,
        default:2
    },
    identidad:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    telefono:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    estado:{
        type:Boolean,
        trim:true,
        default:true
    },
    creada: { 
        type: Date,
        default: Date.now
    },
    conexiones:mongoose.SchemaTypes.Array
});

module.exports = mongoose.model('usuario',usuario);