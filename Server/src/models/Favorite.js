const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./User");

const Video = require("./Video");

const Favorite = sequelize.define("Favorite", {});

// Relations
User.belongsToMany(Video, {
  through: Favorite,

  as: "Favorites",
});

Video.belongsToMany(User, {
  through: Favorite,

  as: "UsersFavorites",
});

module.exports = Favorite;
