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
} from "../Controllers/PostController.js";

const postRouter = express.Router();

// Public routes
postRouter.get("/post", getAllPost);
postRouter.get("/post/:id", getPostById);

// Protected routes (require a valid token)
postRouter.use(verifyToken);
postRouter.post("/post", storePostRequest, createPost);
postRouter.put("/post/:id", updatePostRequest, updatePost);
postRouter.delete("/post/:id", deletePost);

export default postRouter;
