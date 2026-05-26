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

    console.log("STARTING VIDEO PROCESS");

    // TEMP FILE
    const tempInputPath = file.path;

    // ANALYZE VIDEO
    ffmpeg.ffprobe(tempInputPath, async (err, metadata) => {
      if (err) {
        console.log("FFPROBE ERROR");
        console.log(err);

        return res.status(500).json({
          message: "Error analyzing video",
        });
      }

      try {
        const videoStream = metadata.streams.find(
          (s) => s.codec_type === "video",
        );

        const audioStream = metadata.streams.find(
          (s) => s.codec_type === "audio",
        );

        const videoCodec = videoStream?.codec_name;

        const audioCodec = audioStream?.codec_name;

        console.log("VIDEO CODEC:", videoCodec);
        console.log("AUDIO CODEC:", audioCodec);

        const isCompatible =
          videoCodec === "h264" && (audioCodec === "aac" || !audioCodec);

        // DURATION
        const duration = Math.floor(metadata.format.duration || 0);

        // THUMBNAIL
        const thumbnailPath = await generateThumbnail(tempInputPath);

        // ===================================================
        // VIDEO COMPATIBLE
        // ===================================================

        if (isCompatible) {
          console.log("VIDEO IS COMPATIBLE");

          // UPLOAD ORIGINAL VIDEO
          const uploadedVideo = await cloudinary.uploader.upload(
            tempInputPath,
            {
              resource_type: "video",
              folder: "proyectoe/videos",
            },
          );

          // UPLOAD THUMBNAIL
          const uploadedThumbnail = await cloudinary.uploader.upload(
            thumbnailPath,
            {
              folder: "proyectoe/thumbnails",
            },
          );

          // CREATE VIDEO
          const video = await Video.create({
            title,

            description,

            filename: uploadedVideo.secure_url,

            thumbnail: uploadedThumbnail.secure_url,

            duration,

            shareId: uuidv4(),

            UserId: req.user.id,

            categoryId: categoryId || null,

            visibility: "public",

            views: 0,

            status: "processed",
          });

          // CLEAN FILES
          if (fs.existsSync(tempInputPath)) {
            fs.unlinkSync(tempInputPath);
          }

          if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
          }

          return res.status(201).json({
            message: "Video uploaded successfully",

            video,
          });
        }

        // ===================================================
        // VIDEO NEEDS CONVERSION
        // ===================================================

        console.log("VIDEO NEEDS CONVERSION");

        // TEMP OUTPUT
        const outputPath = path.join(
          __dirname,
          `../../processed-${Date.now()}.mp4`,
        );

        // CREATE TEMP VIDEO
        const video = await Video.create({
          title,

          description,

          filename: "",

          thumbnail: "",

          duration,

          shareId: uuidv4(),

          UserId: req.user.id,

          categoryId: categoryId || null,

          visibility: "public",

          views: 0,

          status: "processing",
        });

        // FAST RESPONSE
        res.status(201).json({
          message: "Video processing started",

          video,
        });

        // CONVERT VIDEO
        ffmpeg(tempInputPath)
          .videoCodec("libx264")

          .audioCodec("aac")

          .outputOptions(["-preset fast", "-movflags +faststart"])

          .save(outputPath)

          .on("end", async () => {
            try {
              console.log("VIDEO CONVERTED");

              // UPLOAD CONVERTED VIDEO
              const uploadedVideo = await cloudinary.uploader.upload(
                outputPath,
                {
                  resource_type: "video",
                  folder: "proyectoe/videos",
                },
              );

              // UPLOAD THUMBNAIL
              const uploadedThumbnail = await cloudinary.uploader.upload(
                thumbnailPath,
                {
                  folder: "proyectoe/thumbnails",
                },
              );

              // UPDATE VIDEO
              await video.update({
                filename: uploadedVideo.secure_url,

                thumbnail: uploadedThumbnail.secure_url,

                status: "processed",
              });

              // CLEAN FILES
              if (fs.existsSync(tempInputPath)) {
                fs.unlinkSync(tempInputPath);
              }

              if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
              }

              if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
              }

              console.log("PROCESS FINISHED");
            } catch (error) {
              console.log("UPLOAD ERROR");
              console.log(error);

              await video.update({
                status: "error",
              });
            }
          })

          .on("error", async (error) => {
            console.log("FFMPEG ERROR");
            console.log(error);

            await video.update({
              status: "error",
            });
          });
      } catch (error) {
        console.log("GENERAL PROCESS ERROR");
        console.log(error);

        return res.status(500).json({
          message: error.message,
        });
      }
    });
  } catch (error) {
    console.log("CREATE VIDEO ERROR");
    console.log(error);

    res.status(500).json({
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
