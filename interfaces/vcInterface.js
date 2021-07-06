const {editXp} = require('./xpInterface')

/**
 *  guildId: {
 *      memberId: number
 *  }
 */
let guildVoiceCache = {};

function setVcJoin(userID, guildID, joinTime){
    if (!guildVoiceCache[guildID]) guildVoiceCache[guildID] = {}
    guildVoiceCache[guildID][userID] = joinTime;
}

/**
 * Used for when levels are checked
 * @param userID string - Discord id of the member
 * @param guildID string - Discord id of the guild
 */
async function updateVcExp(userID, guildID){
    if (!guildVoiceCache[guildID] || !guildVoiceCache[guildID][userID] || Math.floor((Date.now() - guildVoiceCache[guildID][userID]) / 60000) <= 0) return;
    await editXp(userID, guildID, '+', (Math.floor((Date.now() - guildVoiceCache[guildID][userID]) / 60000))*3)
    /**
     * Using this instead of Date.now()
     * so that it retains experience
     * that way hopefully if people are
     * spamming the level command it
     * won't break.
     */
    setVcJoin(userID, guildID, Date.now() - ((((Date.now() - guildVoiceCache[guildID][userID]) / 60000) - (Math.floor((Date.now() - guildVoiceCache[guildID][userID]) / 60000))))*60000)
}

function deleteVcJoin(userID, guildID) {
    if (guildVoiceCache[guildID] && guildVoiceCache[guildID][userID]) delete guildVoiceCache[guildID][userID];
}

function getCache(){
    return guildVoiceCache;
}

module.exports = {
    setVcJoin: setVcJoin,
    updateVcExp: updateVcExp,
    deleteVcJoin: deleteVcJoin,
    getCache: getCache
}