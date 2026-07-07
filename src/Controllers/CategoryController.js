import Category from "../Models/Category.js";
import slugify from "slugify";

// Shared error handler for category controllers
const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).send({
      status: false,
      message: "Category already exists",
    });
  }

  if (error.name === "CastError") {
    return res.status(404).send({
      status: false,
      message: "Invalid Category id",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }

  console.error("Something went wrong ", error);
  return res.status(500).send({
    status: false,
    message: "Internal Server Error",
  });
};

// For get all category
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).send({ status: true, data: categories });
  } catch (error) {
    return handleError(res, error);
  }
};

// For get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Invalid Category id",
      });
    }

    return res.status(200).send({ status: true, data: category });
  } catch (error) {
    return handleError(res, error);
  }
};

// For Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Generate Slug
    const generateSlug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const newCategory = await Category.create({
      name,
      slug: generateSlug,
      description,
    });

    return res.status(201).send({
      status: true,
      message: "Category Created Successfully",
      data: newCategory,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// For update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const update = {};

    if (name !== undefined) {
      update.name = name;
      update.slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    if (description !== undefined) {
      update.description = description;
    }

    const category = await Category.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Invalid Category id",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Category updated Successfully",
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// For delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).send({
        status: false,
        message: "Invalid Category id",
      });
    }

    return res
      .status(200)
      .send({ status: true, message: "Category deleted Successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

export {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
