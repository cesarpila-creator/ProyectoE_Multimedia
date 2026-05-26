const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath = require("ffmpeg-static");

const ffprobePath = require("ffprobe-static").path;

ffmpeg.setFfmpegPath(ffmpegPath);

ffmpeg.setFfprobePath(ffprobePath);

const { v4: uuidv4 } = require("uuid");

const Video = require("../models/Video");

const User = require("../models/User");

const Category = require("../models/category");

const cloudinary = require("../config/cloudinary");

const fs = require("fs");

const path = require("path");

const { generateThumbnail } = require("../services/ffmpeg.service");

// GET ALL VIDEOS
const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "username"],
        },

        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json(videos);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET VIDEO BY ID
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "username"],
        },

        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    res.json(video);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET VIDEO BY SHARE ID
const getVideoByShareId = async (req, res) => {
  try {
    const video = await Video.findOne({
      where: {
        shareId: req.params.shareId,
      },

      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "username"],
        },

        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    res.json(video);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE VIDEO
const createVideo = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Video file required",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    console.log("STARTING CLOUDINARY UPLOAD");

    // TEMP FILE
    const tempInputPath = file.path;

    // UPLOAD VIDEO
    const uploadedVideo = await cloudinary.uploader.upload(tempInputPath, {
      resource_type: "video",

      folder: "proyectoe/videos",
    });

    console.log("VIDEO UPLOADED");

    // CREATE VIDEO
    const video = await Video.create({
      title,

      description,

      filename: uploadedVideo.secure_url,

      thumbnail:
        uploadedVideo.secure_url.replace("/upload/", "/upload/so_1/") + ".jpg",

      duration: 0,

      shareId: uuidv4(),

      UserId: req.user.id,

      categoryId: categoryId || null,

      visibility: "public",

      views: 0,

      status: "processed",
    });

    // DELETE TEMP FILE
    if (fs.existsSync(tempInputPath)) {
      fs.unlinkSync(tempInputPath);
    }

    return res.status(201).json({
      message: "Video uploaded successfully",

      video,
    });
  } catch (error) {
    console.log("CREATE VIDEO ERROR");

    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY VIDEOS
const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      where: {
        UserId: req.user.id,
      },

      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "username"],
        },

        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    res.json(videos);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE VIDEO
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, categoryId, visibility } = req.body;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({
        message: "Video no encontrado",
      });
    }

    if (video.UserId !== req.user.id) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    await video.update({
      title,

      description,

      categoryId: categoryId || null,

      visibility,
    });

    res.json({
      message: "Video actualizado correctamente",

      video,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE VIDEO
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({
        message: "Video no encontrado",
      });
    }

    if (video.UserId !== req.user.id) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    try {
      const urlParts = video.filename.split("/");

      const fileName = urlParts[urlParts.length - 1];

      const publicId = fileName.split(".")[0];

      await cloudinary.uploader.destroy(`proyectoe/videos/${publicId}`, {
        resource_type: "video",
      });
    } catch (error) {
      console.log("Cloudinary delete error", error);
    }

    await video.destroy();

    res.json({
      message: "Video eliminado correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getVideos,

  createVideo,

  getVideoById,

  getVideoByShareId,

  getMyVideos,

  updateVideo,

  deleteVideo,
};
