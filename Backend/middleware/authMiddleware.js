const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../controllers/authController");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    req.user = jwt.verify(token, ACCESS_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
