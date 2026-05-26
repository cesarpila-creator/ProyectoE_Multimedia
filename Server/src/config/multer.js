const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("./cloudinary");

// STORAGE
const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "proyectoe/videos",

    resource_type: "video",

    public_id: Date.now() + "-" + file.originalname,
  }),
});

// FILTER
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "video/mp4",
    "video/mkv",
    "video/webm",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid video format"), false);
  }
};

// MULTER
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 1024 * 1024 * 1024 * 5,
  },
});

module.exports = upload;
