import Category from "../Models/Category.js";

// For get all category
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).send({ status: true, data: categories });
  } catch (error) {
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
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
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// For Create Category
const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const newCategory = await Category.create({
      name,
      slug,
      description,
    });

    return res.status(201).send({
      status: true,
      message: "Category Created Successfully",
      data: newCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({
        status: false,
        message: "Category already exists",
      });
    }
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// For update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true, runValidators: true },
    );

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
    if (error.code === 11000) {
      return res.status(409).send({
        status: false,
        message: "Category already exists",
      });
    }
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
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
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
