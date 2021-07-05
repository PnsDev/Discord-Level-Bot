const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildID: String,
    rewardRoles: Array,
    xpIncrements: Number,
    xpBase: Number
});

module.exports = mongoose.model("guild", guildSchema);