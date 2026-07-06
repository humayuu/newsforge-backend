import Joi from "joi";

// validations rules for save Category
const storeCategoryRequest = async (req, res, next) => {
  try {
    const categorySchema = Joi.object({
      name: Joi.string().required().min(3).max(100),
      description: Joi.string().required().min(20).max(300),
    });

    const { error, value } = categorySchema.validate(req.body);

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

// validations rules for update Category
const updateCategoryRequest = async (req, res, next) => {
  try {
    const categorySchema = Joi.object({
      name: Joi.string().min(3).max(100),
      slug: Joi.string().min(3).max(100),
      description: Joi.string().min(20).max(300),
    }).min(1);

    const { error, value } = categorySchema.validate(req.body);

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

export { storeCategoryRequest, updateCategoryRequest };
