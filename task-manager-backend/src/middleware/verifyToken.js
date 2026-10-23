const jwt = require("jsonwebtoken");

/**
 * Verifies the Authorization: Bearer <token> header using JWT_SECRET.
 * On success, attaches the decoded payload to req.user and calls next().
 * On failure, responds with 401 and does not call next().
 *
 * Expects the JWT payload to include at least: { id, email, is_verified, role }
 * (matching whatever shape verifyOtp/login already sign into the token).
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Malformed authorization header." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = verifyToken;
