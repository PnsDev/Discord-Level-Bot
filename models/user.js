const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userID: String,
    guildID: String,
    xp: Number
});

module.exports = mongoose.model("user", userSchema);