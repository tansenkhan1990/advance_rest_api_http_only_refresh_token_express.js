const express = require("express");
const { register, login, refreshToken, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
