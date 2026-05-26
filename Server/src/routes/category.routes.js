const express = require("express");

const router = express.Router();

const {
  getCategories,

  createCategory,

  updateCategory,

  deleteCategory,
} = require("../controllers/category.controller");

// GET
router.get("/", getCategories);

// CREATE
router.post("/", createCategory);

// UPDATE
router.put("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

module.exports = router;
