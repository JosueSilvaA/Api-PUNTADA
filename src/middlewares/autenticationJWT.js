const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

router.use((req, res, next) => {
    const token = req.headers['access-token']
    if (token) {
        jwt.verify(token, 'key', (err, decoded) => {
            if (err) {
                res.send({ mensaje: 'invalid token' })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        res.send({
            message: 'token required'
        })
    }
})

module.exports = router;