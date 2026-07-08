import Joi from "joi";

// validations rules for signup
const signupValidation = async (req, res, next) => {
  try {
    const userSchema = Joi.object({
      name: Joi.string().required().min(3).max(100),
      email: Joi.string().email().required().min(5).max(100).lowercase(),
      password: Joi.string().required().min(8),
      password_confirmation: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .messages({
          "any.only": "Passwords do not match",
        }),
    });

    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    req.body = value; // use normalized values (e.g. lowercased email)
    next();
  } catch (error) {
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// validations rules for login
const loginValidation = async (req, res, next) => {
  try {
    const userSchema = Joi.object({
      email: Joi.string().email().required().lowercase(),
      password: Joi.string().required(),
    });

    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    req.body = value; // use normalized values (e.g. lowercased email)
    next();
  } catch (error) {
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export { signupValidation, loginValidation };
