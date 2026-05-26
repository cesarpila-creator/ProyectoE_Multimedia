
const express = require("express");

const cors = require("cors");

const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/auth.routes");

const videoRoutes = require("./routes/video.routes");

const favoriteRoutes = require("./routes/favorite.routes");

const categoryRoutes = require("./routes/category.routes");

// Database
const sequelize = require("./config/database");

// Models
require("./models/User");

require("./models/Video");

require("./models/Favorite");

require("./models/Category");

// App
const app = express();

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Sync tables
sequelize.sync({ alter: true }).then(() => {
  console.log("Tables synchronized");
});

// Middlewares
app.use(cors());

app.use(express.json());

app.use("/storage", express.static("storage"));

app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/categories", categoryRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({
    message: "API Running Successfully",
  });
});

// Export
module.exports = app;
