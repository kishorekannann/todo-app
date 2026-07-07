const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createTodo,
    getTodosByList,
    updateTodo,
    deleteTodo,
} = require("../controllers/todoController");


router.post("/", protect, createTodo);

router.get("/list/:listId", getTodosByList);


router.put("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);

module.exports = router;
