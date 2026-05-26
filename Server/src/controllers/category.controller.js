const Category = require("../models/category");

const Video = require("../models/Video");

// GET categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Video,
          attributes: ["id"],
        },
      ],
    });

    const formatted = categories.map((category) => ({
      id: category.id,
      name: category.name,
      totalVideos: category.Videos.length,
    }));

    res.json(formatted);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error loading categories",
    });
  }
};

// CREATE category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
    });

    res.status(201).json(category);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error creating category",
    });
  }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    category.name = name;

    await category.save();

    res.json(category);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error updating category",
    });
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [Video],
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (category.Videos.length > 0) {
      return res.status(400).json({
        message: "No se puede eliminar una categoría con videos",
      });
    }

    await category.destroy();

    res.json({
      message: "Category deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error deleting category",
    });
  }
};
