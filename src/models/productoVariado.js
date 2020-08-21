const mongoose = require('mongoose');

const productoVariado = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  proveedor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'proveedores'
  },
  imgProducto: {
    type: String,
    trim: true,
    default:
      "https://www.combinatoria.com.ar/wp-content/uploads/sites/7/2018/09/Indicadores-ecommerce-vender-online1170x550-900x.png",
  },
  precio: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    trim: true,
    default: 1,
  },
  tipoVariado: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  estado: {
    type: mongoose.SchemaTypes.Boolean,
    default: true,
  },
  creada: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('productosVariados',productoVariado);