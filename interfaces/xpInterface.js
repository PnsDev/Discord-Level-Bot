const userSchema = require('../models/user'), {getUser} = require('./dbInterface')

/**
 * Returns the amount of experience a member has in a specified guild.
 * @param userID string - Discord id of the member
 * @param guildID string - Discord id of the guild
 * @returns {Promise<number>}
 */
async function getXp(userID, guildID) {
    let memberDB = await getUser({userID: userID, guildID: guildID})
    if (!memberDB.success) {
        if (memberDB.reason === 'No document found in the db') return 0;
        throw(memberDB.reason);
    } else if (!memberDB.result.xp) {
        memberDB.result.xp = 0;
        memberDB.result.save()
        return 0;
    }
    return memberDB.result.xp;
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
        tempXp.level++;
        settings.nextLevel = (settings.nextLevel * settings.multiplier).toFixed(0);
    }
    tempXp.nextLevel = settings.nextLevel;
    return tempXp;
}

async function setXp(userID, guildID, amount){
    let memberDB = await getUser({userID: userID, guildID: guildID})
    if (!memberDB.success) {
        if (memberDB.reason !== 'No document found in the db') throw(memberDB.reason);
        return (await new userSchema({
            userID: userID,
            guildID: guildID,
            xp: amount
        }).save())
    }
    memberDB.result.xp = amount;
    return (await memberDB.result.save());
}

/**
 * Edit the amount of xp that a member has.
 * @param userID string - Discord id of the member
 * @param guildID string - Discord id of the guild
 * @param operation string - + or -
 * @param amount number - The amount the operation is performing
 * @returns {Promise<void>}
 */
async function editXp(userID, guildID, operation, amount){
    if (!['+', '-'].includes(operation)) throw('Invalid operator passed in editXp function')
    let memberDB = await getUser({userID: userID, guildID: guildID})
    if (!memberDB.success) {
        if (memberDB.reason !== 'No document found in the db') throw(memberDB.reason);
        return (await new userSchema({
            userID: userID,
            guildID: guildID,
            xp: (operation === '+' ? amount : -amount)
        }).save())
    }
    if (!memberDB.result.xp) memberDB.result.xp = 0;
    memberDB.result.xp += (operation === '+' ? amount : -amount);
    return (await memberDB.result.save());
}

module.exports = {
    getXp: getXp,
    calculateLevel: calculateLevel,
    setXp: setXp,
    editXp: editXp
}