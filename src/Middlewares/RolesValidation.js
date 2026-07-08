const validateRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).send({
          status: false,
          message: "Unauthorized: please login first",
        });
      }

      if (allowedRoles.includes(req.user.role)) {
        return next();
      }

      return res.status(403).send({
        status: false,
        message: "You are not authorized to perform this action",
      });
    } catch (error) {
      console.log("Something went wrong ", error);

      return res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  };
};

export default validateRoles;
