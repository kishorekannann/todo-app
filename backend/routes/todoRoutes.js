const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createTodo,
    getTodosByList,
    updateTodo,
    deleteTodo,
} = require("../controllers/todoController");

// @desc    Create a new Todo Item
router.post("/", protect, createTodo);

// @desc    Get all Todo Items in a specific list
router.get("/list/:listId", getTodosByList);

// @desc    Update or delete a Todo Item
router.put("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);

module.exports = router;
