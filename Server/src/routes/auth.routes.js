const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/login", login);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user,
  });
});
router.get(
  "/admin",

  authMiddleware,

  roleMiddleware("admin"),

  (req, res) => {
    res.json({
      message: "Welcome admin",
    });
  },
);

module.exports = router;
