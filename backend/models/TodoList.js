const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    shareToken: {
        type: String,
        default: null,
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("TodoList", todoListSchema);