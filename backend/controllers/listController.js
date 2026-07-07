const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");
const generateShareToken = require("../utils/generateShareToken");
const { verifyToken } = require("../utils/jwt");

const createList = async (req, res) => {
    try {
        const { title, isPublic } = req.body;

        if (!title) {
            return res.status(400).json({ message: "List title is required" });
        }

        const todoList = await TodoList.create({
            title,
            owner: req.user.id,
            isPublic: isPublic !== undefined ? isPublic : true,
        });

        res.status(201).json(todoList);
    } catch (error) {
        console.error("Create List Error:", error);
        res.status(500).json({ message: "Server error creating list" });
    }
};


const getLists = async (req, res) => {
    try {
        const lists = await TodoList.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(lists);
    } catch (error) {
        console.error("Get Lists Error:", error);
        res.status(500).json({ message: "Server error fetching lists" });
    }
};


const getListById = async (req, res) => {
    try {
        const list = await TodoList.findById(req.params.id);

        if (!list) {
            return res.status(404).json({ message: "Todo list not found" });
        }

        // If list is not public, verify owner
        if (!list.isPublic) {
            let authorized = false;
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                const token = req.headers.authorization.split(" ")[1];
                const decoded = verifyToken(token);
                if (decoded && decoded.id === list.owner.toString()) {
                    authorized = true;
                }
            }

            if (!authorized) {
                return res.status(403).json({ message: "Access denied. Private list." });
            }
        }

        res.json(list);
    } catch (error) {
        console.error("Get List Error:", error);
        res.status(500).json({ message: "Server error fetching list" });
    }
};


const updateList = async (req, res) => {
    try {
        const { title, isPublic } = req.body;
        const list = await TodoList.findById(req.params.id);

        if (!list) {
            return res.status(404).json({ message: "Todo list not found" });
        }

        // Check if logged-in user is the owner
        if (list.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this list" });
        }

        if (title !== undefined) list.title = title;
        if (isPublic !== undefined) list.isPublic = isPublic;

        const updatedList = await list.save();
        res.json(updatedList);
    } catch (error) {
        console.error("Update List Error:", error);
        res.status(500).json({ message: "Server error updating list" });
    }
};


const deleteList = async (req, res) => {
    try {
        const list = await TodoList.findById(req.params.id);

        if (!list) {
            return res.status(404).json({ message: "Todo list not found" });
        }

        // Check if logged-in user is the owner
        if (list.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this list" });
        }

        // Delete all todos belonging to this list
        await Todo.deleteMany({ list: list._id });
        // Delete the list itself
        await list.deleteOne();

        res.json({ message: "Todo list and all associated todos removed" });
    } catch (error) {
        console.error("Delete List Error:", error);
        res.status(500).json({ message: "Server error deleting list" });
    }
};


const shareList = async (req, res) => {
    try {
        const list = await TodoList.findById(req.params.id);

        if (!list) {
            return res.status(404).json({ message: "Todo list not found" });
        }

        if (list.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to share this list" });
        }

        list.shareToken = generateShareToken();
        await list.save();

        res.json({ shareToken: list.shareToken });
    } catch (error) {
        console.error("Share List Error:", error);
        res.status(500).json({ message: "Server error sharing list" });
    }
};


const getListByShareToken = async (req, res) => {
    try {
        const list = await TodoList.findOne({ shareToken: req.params.shareToken });

        if (!list) {
            return res.status(404).json({ message: "Shared list not found" });
        }

        res.json(list);
    } catch (error) {
        console.error("Get Shared List Error:", error);
        res.status(500).json({ message: "Server error fetching shared list" });
    }
};

module.exports = {
    createList,
    getLists,
    getListById,
    updateList,
    deleteList,
    shareList,
    getListByShareToken,
};
