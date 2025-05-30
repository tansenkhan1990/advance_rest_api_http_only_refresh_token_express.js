const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");

require("dotenv").config();
const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser());
// ✅ Restrict access to only localhost:4000
app.use(cors({ origin: "http://localhost:4000", credentials: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
