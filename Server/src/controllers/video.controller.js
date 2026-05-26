const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath = require("ffmpeg-static");

const ffprobePath = require("ffprobe-static").path;

ffmpeg.setFfmpegPath(ffmpegPath);

ffmpeg.setFfprobePath(ffprobePath);

const { v4: uuidv4 } = require("uuid");

const Video = require("../models/Video");

const User = require("../models/User");

const Category = require("../models/category");

const path = require("path");

const fs = require("fs");

const {
  generateThumbnail,
  getVideoDuration,
} = require("../services/ffmpeg.service");

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
// CREATE VIDEO
const createVideo = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;

    const file = req.file;

    // VALIDATIONS
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

    const inputPath = path.join(
      __dirname,
      "../../storage/videos",
      file.filename,
    );

    // CHECK CODEC
    ffmpeg.ffprobe(
      inputPath,

      async (err, metadata) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Error analyzing video",
          });
        }

        const videoStream = metadata.streams.find(
          (s) => s.codec_type === "video",
        );

        const audioStream = metadata.streams.find(
          (s) => s.codec_type === "audio",
        );

        const videoCodec = videoStream?.codec_name;

        const audioCodec = audioStream?.codec_name;

        const isCompatible =
          videoCodec === "h264" && (audioCodec === "aac" || !audioCodec);

        // THUMBNAIL
        let thumbnail = null;

        // ONLY GENERATE NOW
        // IF COMPATIBLE
        if (isCompatible) {
          thumbnail = await generateThumbnail(file.filename);
        }

        // DURATION
        const duration = await getVideoDuration(file.filename);

        // CREATE VIDEO
        const video = await Video.create({
          title,

          description,

          filename: file.filename,

          thumbnail,

          duration: Math.floor(duration),

          shareId: uuidv4(),

          UserId: req.user.id,

          categoryId: categoryId || null,

          visibility: "public",

          views: 0,

          status: isCompatible ? "processed" : "processing",
        });

        // RESPONSE FAST
        res.status(201).json({
          message: isCompatible
            ? "Video uploaded successfully"
            : "Video uploaded and processing started",

          video,
        });

        // IF COMPATIBLE
        if (isCompatible) {
          return;
        }

        // CONVERT IN BACKGROUND
        const outputFilename = `processed-${Date.now()}.mp4`;

        const outputPath = path.join(
          __dirname,
          "../../storage/videos",
          outputFilename,
        );

        ffmpeg(inputPath)
          .videoCodec("libx264")

          .audioCodec("aac")

          .outputOptions(["-preset fast", "-movflags +faststart"])

          .save(outputPath)

          .on(
            "end",

            async () => {
              console.log("VIDEO PROCESSED");

              // DELETE OLD FILE
              fs.unlinkSync(inputPath);

              // GENERATE NEW THUMBNAIL
              const processedThumbnail =
                await generateThumbnail(outputFilename);

              // UPDATE VIDEO
              await video.update({
                filename: outputFilename,

                thumbnail: processedThumbnail,

                status: "processed",
              });
            },
          )

          .on(
            "error",

            async (error) => {
              console.log(error);

              await video.update({
                status: "error",
              });
            },
          );
      },
    );
  } catch (error) {
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

    // Buscar video
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({
        message: "Video no encontrado",
      });
    }

    // Validar propietario
    if (video.UserId !== req.user.id) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    // Actualizar
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

    // Buscar video
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({
        message: "Video no encontrado",
      });
    }

    // Validar propietario
    if (video.UserId !== req.user.id) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    // Delete video file
    const videoPath = `storage/videos/${video.filename}`;

    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Delete thumbnail
    if (video.thumbnail) {
      const thumbnailPath = `storage/thumbnails/${video.thumbnail}`;

      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Delete DB record
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
