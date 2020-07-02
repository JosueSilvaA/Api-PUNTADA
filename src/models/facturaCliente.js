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
        type:mongoose.SchemaTypes.Array,
        required:true
    },
    nombreEmpleado:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    subTotal:{
        type:mongoose.SchemaTypes.Decimal128,
        required:true,
        trim:true
    },
    isv:{
        type:mongoose.SchemaTypes.Decimal128,
        required:true,
        trim:true
    },
    total:{
        type:mongoose.SchemaTypes.Decimal128,
        required:true,
        trim:true
    },
    creada:{ 
        type: Date,
        default: Date.now
    },
    estado:{
        type:String,
        trim:true,
        required:true
    }
});

module.exports = mongoose.model('facturaCliente',facturaCliente)