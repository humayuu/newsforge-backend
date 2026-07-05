import express from "express";
import { userSignup, userLogin } from "../Controllers/AuthController.js";
import {
  signupValidation,
  loginValidation,
} from "../Middlewares/AuthValidation.js";

const authRouter = express.Router();

authRouter.post("/signup", signupValidation, userSignup);
authRouter.post("/login", loginValidation, userLogin);

export default authRouter;
