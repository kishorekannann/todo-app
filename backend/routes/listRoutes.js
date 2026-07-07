const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createList,
    getLists,
    getListById,
    updateList,
    deleteList,
    shareList,
    getListByShareToken,
} = require("../controllers/listController");

// @desc    Create a new Todo List / Get all user lists
router.post("/", protect, createList);
router.get("/", protect, getLists);

// @desc    Get, update, or delete a specific Todo List
router.get("/:id", getListById);
router.put("/:id", protect, updateList);
router.delete("/:id", protect, deleteList);

// @desc    Generate share token for a Todo List
router.post("/:id/share", protect, shareList);

// @desc    Get Todo List by share token
router.get("/shared/:shareToken", getListByShareToken);

module.exports = router;
