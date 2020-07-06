const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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


usuario.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

usuario.methods.matchPassword = async (data) => {
    return await bcrypt.compare(data.password, data.encryptPassword)
}


module.exports = mongoose.model('usuario',usuario);