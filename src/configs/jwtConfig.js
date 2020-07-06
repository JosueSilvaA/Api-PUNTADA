const jwt = require('jsonwebtoken')


const createJWT = async (data) => {
    const payload = {
        check: true,
        user: data.usuario,
        id: data.id,
        rol: data.rol
    }

    const token = await jwt.sign(payload, 'key', {
        expiresIn: 60 * 60 * 24
    })
    return token;
}

module.exports = createJWT;