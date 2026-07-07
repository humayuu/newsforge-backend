import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        status: false,
        message: "Token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).send({
        status: false,
        message: "Invalid or expired token",
      });
    }

    console.error("Something went wrong ", error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export default verifyToken;
