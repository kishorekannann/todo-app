const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        default: "General",
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TodoList",
        required: true
    },

}, {
    timestamps: true
});

module.exports = mongoose.model("Todo", todoSchema);
