import express from "express";
import {
  storeCategoryRequest,
  updateCategoryRequest,
} from "../Middlewares/CategoryValidation.js";
import verifyToken from "../Middlewares/AuthToken.js";
import validateRoles from "../Middlewares/RolesValidation.js";
import {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Controllers/CategoryController.js";

const categoryRouter = express.Router();

// Public routes
categoryRouter.get("/category", getAllCategory);
categoryRouter.get("/category/:id", getCategoryById);

// Protected routes (require a valid token)
categoryRouter.use(verifyToken, validateRoles("admin"));
categoryRouter.post("/category", storeCategoryRequest, createCategory);
categoryRouter.put("/category/:id", updateCategoryRequest, updateCategory);
categoryRouter.delete("/category/:id", deleteCategory);

export default categoryRouter;
