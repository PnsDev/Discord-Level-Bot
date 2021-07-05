/**
 * Returns the amount of experience a member has in a specified guild.
 * @param userID string - Discord id of the member
 * @param guildID string - Discord id of the guild
 * @returns {Promise<number>}
 */
async function getXp(userID, guildID) {
    return 81;
}

/**
 * Calculates the level of the xp amount supplied.
 * @param xp number - The amount of experience needed to be calculated.
 * @returns {{leftOverXp: number, level: number, overallXp: number, nextLevel: number}}
 */
function calculateLevel(xp){
    let tempXp = {
        level: 0,
        leftOverXp: xp,
        overallXp: xp
    }, settings = {
        nextLevel: 100,
        multiplier: 1.2
    }
    while (tempXp.leftOverXp > settings.nextLevel){
        tempXp.leftOverXp -= settings.nextLevel;
        settings.nextLevel = settings.nextLevel * settings.multiplier;
    }
    tempXp.nextLevel = settings.nextLevel;
    return tempXp;
}

module.exports = {
    getXp: getXp,
    calculateLevel: calculateLevel
}