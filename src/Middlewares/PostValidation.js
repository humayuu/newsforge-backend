import Joi from "joi";

// validations rules for save Post
const storePostRequest = async (req, res, next) => {
  try {
    const postSchema = Joi.object({
      userId: Joi.string().hex().length(24).required(),
      category: Joi.string().hex().length(24).required(),
      title: Joi.string().min(3).max(100).required(),
      content: Joi.string().min(20).max(5000).required(),
      isPublished: Joi.boolean(),
      publishedAt: Joi.date(),
      status: Joi.string().valid("draft", "published", "archived"),
    });

    const { error, value } = postSchema.validate(req.body);

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

// validations rules for update Post
const updatePostRequest = async (req, res, next) => {
  try {
    const postSchema = Joi.object({
      category: Joi.string().hex().length(24),
      title: Joi.string().min(3).max(100),
      content: Joi.string().min(20).max(5000),
      isPublished: Joi.boolean(),
      publishedAt: Joi.date(),
      status: Joi.string().valid("draft", "published", "archived"),
    }).min(1);

    const { error, value } = postSchema.validate(req.body);

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

export { storePostRequest, updatePostRequest };
