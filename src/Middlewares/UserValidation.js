import Joi from "joi";

// validations rules for Create user
const storeUserRequest = async (req, res, next) => {
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
      role: Joi.string().valid("admin", "author", "reader").default("reader"),
      status: Joi.boolean().default(true),
    });

    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    req.body = value;
    next();
  } catch (error) {
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// validations rules for Update user
const updateUserRequest = async (req, res, next) => {
  try {
    const userSchema = Joi.object({
      name: Joi.string().min(3).max(100),
      email: Joi.string().email().min(5).max(100).lowercase(),
      password: Joi.string().min(8),
      password_confirmation: Joi.string()
        .valid(Joi.ref("password"))
        .when("password", {
          is: Joi.exist(),
          then: Joi.required(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "any.only": "Passwords do not match",
          "any.unknown": "password_confirmation is not allowed without password",
        }),
      role: Joi.string().valid("admin", "author", "reader"),
      status: Joi.boolean(),
    }).min(1);

    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        status: false,
        message: error.details[0].message,
      });
    }

    req.body = value;
    next();
  } catch (error) {
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export { storeUserRequest, updateUserRequest };
