const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./User");
const Category = require("./category");

const Video = sequelize.define("Video", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
  },

  filename: {
    type: DataTypes.STRING,
  },

  thumbnail: {
    type: DataTypes.STRING,
  },

  duration: {
    type: DataTypes.STRING,
  },

  shareId: {
    type: DataTypes.STRING,
    unique: true,
  },

  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  visibility: {
    type: DataTypes.STRING,
    defaultValue: "public",
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "processing",
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// USER RELATIONS
User.hasMany(Video, {
  foreignKey: "UserId",
});

Video.belongsTo(User, {
  foreignKey: "UserId",
  as: "User",
});

// CATEGORY RELATIONS
Category.hasMany(Video, {
  foreignKey: "categoryId",
});

Video.belongsTo(Category, {
  foreignKey: "categoryId",
});

module.exports = Video;
