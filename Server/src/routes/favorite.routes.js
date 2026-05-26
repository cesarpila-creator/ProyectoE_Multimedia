const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  toggleFavorite,

  getFavorites,
} = require("../controllers/favorite.controller");

// Toggle
router.post("/:videoId", authMiddleware, toggleFavorite);

// Get favorites
router.get("/", authMiddleware, getFavorites);

module.exports = router;
