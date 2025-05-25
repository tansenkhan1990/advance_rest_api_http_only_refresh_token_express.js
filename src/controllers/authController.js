const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, users } = require("../models/User");

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // ✅ Use a readable format for expiration
    );

    const refreshToken = jwt.sign(
        { username: user.username },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" } // ✅ 7-day validity for refresh token
    );

    return { accessToken, refreshToken };
};

const register = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing credentials" });
    }

    const userExists = users.find((u) => u.username === username);
    if (userExists) {
        return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User(username, password);
    users.push(newUser);

    res.status(201).json({ message: "User registered successfully!" });
};

const login = (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    console.log("Generated Tokens:", { accessToken, refreshToken });  // 🔹 Debugging line

    res.cookie("jwt", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

    res.json({ message: "Logged in successfully!" });
};

const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = users.find((u) => u.username === decoded.username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { accessToken } = generateTokens(user);
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });

        res.json({ message: "Token refreshed!" });
    } catch (err) {
        res.status(403).json({ error: "Invalid refresh token" });
    }
};

const logout = (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully!" });
};

module.exports = { register, login, refreshToken, logout };
