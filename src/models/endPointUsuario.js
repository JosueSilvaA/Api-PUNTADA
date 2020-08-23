const mongoose = require("mongoose");

const endPointUsuario = new mongoose.Schema({
  userEndPoint: {
    type: mongoose.SchemaTypes.Mixed,
  },
  usuario: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "usuario",
    required: true,
  },
});

module.exports = mongoose.model("endPointUsuario", endPointUsuario);