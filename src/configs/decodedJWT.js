const jwt = require('jsonwebtoken')

//Retorna los datos del usuario decodificados
const decodedJWT = (token) => {
    const tokenDecoded = jwt.verify(token, 'key')

    return ({
        user: tokenDecoded.user,
        id: tokenDecoded.id,
        rol: tokenDecoded.rol
    })
}

module.exports = decodedJWT;