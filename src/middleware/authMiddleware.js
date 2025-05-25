const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    console.log("Cookies received in request:", req.cookies);  // 🔹 Debugging line

    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - No Token Found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);  // 🔹 Debugging line
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);  // 🔹 Debugging line
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = { authenticate };
