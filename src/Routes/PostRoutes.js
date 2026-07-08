import express from "express";
import {
  storePostRequest,
  updatePostRequest,
} from "../Middlewares/PostValidation.js";
import verifyToken from "../Middlewares/AuthToken.js";
import {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getAllPostForDashboard,
} from "../Controllers/PostController.js";
import validateRoles from "../Middlewares/RolesValidation.js";
const postRouter = express.Router();

// Public routes
postRouter.get("/post", getAllPost);

// Admin and Author Dashboard Routes
postRouter.get(
  "/post/dashboard",
  verifyToken,
  validateRoles("admin", "author"),
  getAllPostForDashboard,
);

postRouter.get("/post/:id", getPostById);

// Protected routes (require a valid token)
postRouter.use(verifyToken, validateRoles("admin", "author"));
postRouter.post("/post", storePostRequest, createPost);
postRouter.put("/post/:id", updatePostRequest, updatePost);
postRouter.delete("/post/:id", deletePost);

export default postRouter;
