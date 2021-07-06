const {redBright} = require('chalk'), {editXp} = require('../../interfaces/xpInterface')

module.exports = async (client, messageReaction, user) => {
    if (user.bot) return;
    if (messageReaction.message.guild.id !== null){
        try {
            editXp(user.id, messageReaction.message.guild.id, '+', 1)
        } catch (e) {
            console.log(redBright(`==================\nAuthor: ${user.tag} // ${user.id}\nAction: Adding Reaction Xp\nStack Error:\n${e.stack}\n==================`))
        }
    }
};