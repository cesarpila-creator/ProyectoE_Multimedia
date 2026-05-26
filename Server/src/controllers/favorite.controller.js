const User = require("../models/User");

const Video = require("../models/Video");

// TOGGLE FAVORITE
const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    const video = await Video.findByPk(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Check existing
    const existing = await user.hasFavorite(video);

    // Remove favorite
    if (existing) {
      await user.removeFavorite(video);

      return res.json({
        message: "Removed from favorites",
      });
    }

    // Add favorite
    await user.addFavorite(video);

    res.json({
      message: "Added to favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET FAVORITES
const getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          association: "Favorites",

          include: [
            {
              association: "User",

              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    res.json(user.Favorites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  toggleFavorite,

  getFavorites,
};
