const express = require("express");

const upload = require("../config/multer");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getVideos,
  createVideo,
  getVideoById,
  getVideoByShareId,
  getMyVideos,
  updateVideo,
  deleteVideo,
} = require("../controllers/video.controller");

// Public
router.get("/", getVideos);
router.get("/my-videos", authMiddleware, getMyVideos);
router.put("/:id", authMiddleware, updateVideo);
router.delete("/:id", authMiddleware, deleteVideo);
router.get("/share/:shareId", getVideoByShareId);
router.get("/:id", getVideoById);

// Private
router.post("/upload", authMiddleware, upload.single("video"), createVideo);

module.exports = router;
