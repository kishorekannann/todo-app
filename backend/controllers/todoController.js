const Todo = require("../models/Todo");
const TodoList = require("../models/TodoList");
const { verifyToken } = require("../utils/jwt");


const verifyListAccess = async (listId, userId, writeAccess = true) => {
    const list = await TodoList.findById(listId);
    if (!list) return { status: 404, message: "Todo list not found" };

    if (writeAccess) {

        if (list.owner.toString() !== userId) {
            return { status: 403, message: "Not authorized to modify this list" };
        }
    } else {

        if (!list.isPublic && list.owner.toString() !== userId) {
            return { status: 403, message: "Access denied. Private list." };
        }
    }
    return null;
};


const createTodo = async (req, res) => {
    try {
        const { title, tag, list } = req.body;

        if (!title || !list) {
            return res.status(400).json({ message: "Title and List ID are required" });
        }

        // Verify list ownership
        const accessError = await verifyListAccess(list, req.user.id, true);
        if (accessError) {
            return res.status(accessError.status).json({ message: accessError.message });
        }

        const todo = await Todo.create({
            title,
            tag: tag || "General",
            list,
        });

        res.status(201).json(todo);
    } catch (error) {
        console.error("Create Todo Error:", error);
        res.status(500).json({ message: "Server error creating todo" });
    }
};

const getTodosByList = async (req, res) => {
    try {
        const { listId } = req.params;
        const list = await TodoList.findById(listId);

        if (!list) {
            return res.status(404).json({ message: "Todo list not found" });
        }

        // Check read authorization
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

        const todos = await Todo.find({ list: listId }).sort({ createdAt: 1 });
        res.json(todos);
    } catch (error) {
        console.error("Get Todos Error:", error);
        res.status(500).json({ message: "Server error fetching todos" });
    }
};


const updateTodo = async (req, res) => {
    try {
        const { title, completed, tag } = req.body;
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: "Todo item not found" });
        }

        // Verify list ownership
        const accessError = await verifyListAccess(todo.list, req.user.id, true);
        if (accessError) {
            return res.status(accessError.status).json({ message: accessError.message });
        }

        if (title !== undefined) todo.title = title;
        if (completed !== undefined) todo.completed = completed;
        if (tag !== undefined) todo.tag = tag;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        console.error("Update Todo Error:", error);
        res.status(500).json({ message: "Server error updating todo" });
    }
};


const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: "Todo item not found" });
        }


        const accessError = await verifyListAccess(todo.list, req.user.id, true);
        if (accessError) {
            return res.status(accessError.status).json({ message: accessError.message });
        }

        await todo.deleteOne();
        res.json({ message: "Todo item removed" });
    } catch (error) {
        console.error("Delete Todo Error:", error);
        res.status(500).json({ message: "Server error deleting todo" });
    }
};

module.exports = {
    createTodo,
    getTodosByList,
    updateTodo,
    deleteTodo,
};
