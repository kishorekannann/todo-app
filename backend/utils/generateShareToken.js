const crypto = require("crypto");

const generateShareToken = () => {
    return crypto.randomBytes(16).toString("hex");
};

module.exports = generateShareToken;
