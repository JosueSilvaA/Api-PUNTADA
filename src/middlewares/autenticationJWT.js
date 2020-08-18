const express = require('express');
const router = express.Router();
const Result = require("../helpers/result");
const jwt = require('jsonwebtoken')

router.use((req, res, next) => {
    let result = Result.createResult();

    const token = req.headers['access-token']
    if (token) {
        jwt.verify(token, 'key', (err, decoded) => {
            if (err) {
                result.Error = true;
                result.Response = "invalid token";
                result.Success = true;
                res.send(result);
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        result.Error = true;
        result.Response = "token required";
        result.Success = true;
        res.send(result);
    }
})

module.exports = router;