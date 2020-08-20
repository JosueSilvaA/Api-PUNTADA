const mongoose = require('mongoose');

const facturaCliente = new mongoose.Schema({
    nombreCliente:{
        type:String,
        trim:true,
        required:true
    },
    rtn:{
        type:String,
        trim:true
    },
    telefono:{
        type:String,
        trim:true
    },
    direccion:{
        type:String,
        trim:true
    },
    fechaFactura:{
        type:Date
    },
    productos:{
        type:Array,
        required:true
    },
    nombreEmpleado:{
        type:mongoose.SchemaTypes.ObjectId,
        ref: 'usuario',
        required:true
    },
    subTotal:{
        type:Number,
        required:true,
        trim:true
    },
    isv:{
        type:Number,
        required:true,
        trim:true
    },
    total:{
        type:Number,
        required:true,
        trim:true
    },
    creada:{ 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('facturaCliente',facturaCliente)