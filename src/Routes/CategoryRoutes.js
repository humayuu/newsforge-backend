import express from "express";
import {
  storeCategoryRequest,
  updateCategoryRequest,
} from "../Middlewares/CategoryValidation.js";
import {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Controllers/CategoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/category", getAllCategory);
categoryRouter.get("/category/:id", getCategoryById);
categoryRouter.post("/category", storeCategoryRequest, createCategory);
categoryRouter.put("/category/:id", updateCategoryRequest, updateCategory);
categoryRouter.delete("/category/:id", deleteCategory);

export default categoryRouter;
