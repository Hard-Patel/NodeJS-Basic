const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "Access denied. No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "myPrivateKey");
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(400).send({ message: "Invalid token" });
  }
}

exports.auth = auth;
