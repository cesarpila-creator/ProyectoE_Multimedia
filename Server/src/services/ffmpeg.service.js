const ffmpeg = require("fluent-ffmpeg");

const path = require("path");

// Generate thumbnail
const generateThumbnail = (videoFilename) => {
  return new Promise((resolve, reject) => {
    const videoPath = path.join("storage/videos", videoFilename);

    const thumbnailFilename = `${Date.now()}.png`;

    const thumbnailPath = path.join("storage/thumbnails", thumbnailFilename);

    ffmpeg(videoPath)
      .screenshots({
        timestamps: ["5"],

        filename: thumbnailFilename,

        folder: "storage/thumbnails",

        size: "1280x720",
      })

      .on("end", () => {
        resolve(thumbnailFilename);
      })

      .on("error", (err) => {
        reject(err);
      });
  });
};

// Get duration
const getVideoDuration = (videoFilename) => {
  return new Promise((resolve, reject) => {
    const videoPath = path.join("storage/videos", videoFilename);

    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;

        resolve(duration);
      }
    });
  });
};

module.exports = {
  generateThumbnail,

  getVideoDuration,
};
