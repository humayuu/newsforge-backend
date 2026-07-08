import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// For User Signup
const userSignup = async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).send({
        status: false,
        message: "User already exists",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    // Create Hashed password
    newUser.password = await bcrypt.hash(password, 12);
    await newUser.save();

    // Create JWT Token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRERS_IN },
    );

    return res.status(201).send({
      status: true,
      message: "User Created Successfully",
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({
        status: false,
        message: "User already exists",
      });
    }
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// For User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({
        status: false,
        message: "Wrong email or password",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({
        status: false,
        message: "Wrong email or password",
      });
    }

    if (!user.status) {
      return res.status(403).send({
        status: false,
        message: "Account is disabled",
      });
    }

    // Create JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRERS_IN },
    );

    return res.status(200).send({
      status: true,
      message: "User LoggedIn Successfully",
      token,
    });
  } catch (error) {
    console.log("Something went wrong ", error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export { userSignup, userLogin };
