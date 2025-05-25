const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticate, (req, res) => {
    res.json({ message: `Welcome to Dashboard, ${req.user.username}!` });
});

router.get("/profile", authenticate, (req, res) => {
    res.json({ username: req.user.username });
});

module.exports = router;
