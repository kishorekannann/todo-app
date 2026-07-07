const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const listRoutes = require("./routes/listRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Todo API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/todos", todoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "An unexpected error occurred" });
});

module.exports = app;