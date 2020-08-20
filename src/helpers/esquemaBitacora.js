const bitacora = require('../models/bitacora');
const estructura = (idUsuario,idEntidad,actividad,finalidad,categoria) =>{
    let nuevoRegistro = new bitacora({
        usuario:idUsuario,
        entidadAlterada:idEntidad,
        actividad:actividad,
        finalidad:finalidad,
        categoria:categoria
    });

    nuevoRegistro.save();
}

module.exports = estructura;