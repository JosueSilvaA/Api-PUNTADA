const express = require("express");
const router = express.Router();
const Result = require("../helpers/result");
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  let result = Result.createResult();

  const token = req.headers["access-token"];
  if (token) {
    jwt.verify(token, "key", (err, decoded) => {
      if (err) {
        result.Error = true;
        result.Response = "invalid token";
        result.Success = true;
        res.send(result);
      } else {
        if (
          decoded.rol === "5f3f14f1963f5800176ca4d4" ||
          decoded.rol === "5f3f1575963f5800176ca4d8" ||
          decoded.rol === "5f3f1537963f5800176ca4d5" 
        ) {
          req.decoded = decoded;
          next();
        } else {
          result.Error = true;
          result.Response =
            "No tienes los permisos necesarios para realizar esta acción!.";
          result.Success = true;
          res.send(result);
        }
      }
    });
  } else {
    result.Error = true;
    result.Response = "token required";
    result.Success = true;
    res.send(result);
  }
});

module.exports = router;
