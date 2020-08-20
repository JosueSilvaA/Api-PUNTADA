const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuario = new mongoose.Schema({
    nombres:{
        type:String,
        required:true,
        trim:true
    },
    apellidos:{
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
        type:mongoose.SchemaTypes.ObjectId,
        ref: 'roles',
        required:true,
        default: '5f0cd30b40fbd42fb0278891'
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
    imgUsuario:{
        type:String,
        trim:true,
        default:'https://img.icons8.com/dusk/64/000000/user-male.png'
    },
    estado:{
        type:Boolean,
        trim:true,
        default:true
    },
    creada: { 
        type: Date,
        default: Date.now
    }
});


usuario.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

usuario.methods.matchPassword = async (data) => {
    return await bcrypt.compare(data.password, data.encryptPassword)
}


module.exports = mongoose.model('usuario',usuario);