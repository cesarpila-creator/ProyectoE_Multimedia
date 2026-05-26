const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Obtener header
    const authHeader = req.headers.authorization;

    // Verificar token
    if (!authHeader) {
      return res.status(401).json({
        message: "Token required",
      });
    }

    // Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // Validar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar user en request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;
