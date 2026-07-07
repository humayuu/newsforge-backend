import User from "../Models/User.js";
import bcrypt from "bcrypt";

// Shared error handler for User controllers
const handleError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).send({
      status: false,
      message: "User with this email already exists",
    });
  }

  if (error.name === "CastError") {
    return res.status(404).send({
      status: false,
      message: "Invalid User id",
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

// For get all Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).send({ status: true, data: users });
  } catch (error) {
    return handleError(res, error);
  }
};

// For get User by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).send({
        status: false,
        message: "Invalid User id",
      });
    }

    return res.status(200).send({ status: true, data: user });
  } catch (error) {
    return handleError(res, error);
  }
};

// For Create User
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        status: false,
        message: "User with this email already exists",
      });
    }

    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role,
      status,
    });

    await newUser.save();

    // Strip password from the response
    const { password: _password, ...data } = newUser.toObject();

    return res.status(201).send({
      status: true,
      message: "User Created Successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// For update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    const update = {};

    if (name !== undefined) {
      update.name = name;
    }

    if (email !== undefined) {
      update.email = email;
    }

    if (password !== undefined) {
      update.password = await bcrypt.hash(password, 12);
    }

    if (role !== undefined) {
      update.role = role;
    }

    if (status !== undefined) {
      update.status = status;
    }

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).send({
        status: false,
        message: "Invalid User id",
      });
    }

    return res.status(200).send({
      status: true,
      message: "User updated Successfully",
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// For delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({
        status: false,
        message: "Invalid User id",
      });
    }

    return res
      .status(200)
      .send({ status: true, message: "User deleted Successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
