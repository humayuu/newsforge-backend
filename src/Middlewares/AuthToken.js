import jwt from "jsonwebtoken";

// Verifies the JWT from the Authorization header and attaches the payload to req.user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).send({
      status: false,
      message: "Authorization token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.status) {
      return res.status(403).send({
        status: false,
        message: "Account is disabled",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

// Restricts a route to the given roles, e.g. authorizeRoles("admin", "author")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send({
        status: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

export { verifyToken, authorizeRoles };
