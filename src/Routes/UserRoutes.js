import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../Controllers/UserController.js";
import {
  storeUserRequest,
  updateUserRequest,
} from "../Middlewares/UserValidation.js";
import validateRoles from "../Middlewares/RolesValidation.js";
import verifyToken from "../Middlewares/AuthToken.js";

const userRouter = express.Router();

// Public routes
userRouter.get("/user", getAllUsers);
userRouter.get("/user/:id", getUserById);

// Protected routes (require a valid token)
userRouter.use(verifyToken, validateRoles("admin"));
userRouter.post("/user", storeUserRequest, createUser);
userRouter.put("/user/:id", updateUserRequest, updateUser);
userRouter.delete("/user/:id", deleteUser);

export default userRouter;
