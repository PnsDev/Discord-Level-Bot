const {MessageEmbed} = require('discord.js'), {redBright} = require('chalk'), {editXp} = require('../../utils/xpInterface')

//=======================
// This handles all the
// commands.
//=======================
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(config.Bot.Prefix)) {
        const args = message.content.slice(config.Bot.Prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        let cmd;
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        }


        if (cmd) {
            if (message.guild === null && cmd.help.useInDM === false) return message.channel.send(new MessageEmbed().setTitle('Woah There!').setDescription(`You can't use this command in a DM!\nPlease use it inside a guild!`).setFooter(`For ${message.author.username}`).setTimestamp().setColor(process.env.BAD_COLOR))
            if (message.guild !== null && cmd.help.useInGuild === false) return message.channel.send(new MessageEmbed().setTitle('Woah There!').setDescription(`You can't use this command in a guild!\nPlease use it inside a DM!`).setFooter(`For ${message.author.username}`).setTimestamp().setColor(process.env.BAD_COLOR))
            /**
             * Pings are parsed here...
             * Pretty much only used for the
             * level command (as you can check
             * other people's level.)
             */
            if (message.guild !== null) {
                for (let i = 0; i < args.length; i++) {
                    let tempMember = args[i];
                    if ((tempMember.startsWith('<@!') || tempMember.startsWith('<@')) && tempMember.endsWith('>')) {
                        try {
                            tempMember = client.guilds.cache.get(message.guild.id).members.cache.get(tempMember.substring(tempMember.startsWith('<@!') ? 3 : 2, tempMember.length - 1));
                            if (tempMember) {
                                args[i] = tempMember;
                                if (tempMember.user.bot) return message.reply(new MessageEmbed().setAuthor('Invalid User').setDescription(`You can not use this command on bots`).setColor(config.Bot.Colors.Bad));
                            }
                        } catch (err) {
                        }
                    }
                }
            }

            /**
             * Most errors are handled
             * within the command but
             * in case they're not.
             */
            try {
                cmd.run(client, message, args);
            } catch (e) {
                console.log(redBright(`==================\nAuthor: ${message.author.tag} // ${message.author.id}\nCommand: ${cmd.help.name}\nStack Error:\n${e.stack}\n==================`))
                message.reply(new MessageEmbed().setAuthor('Woah there').setDescription(`It seems like something went wonky on our end.\nTry again later or tell the bot owner to check console.`).setColor(config.Bot.Colors.Bad));
            }
        }
    } else if (message.guild !== null){
        if (!(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/).test(message.content.split('')[0])){
            try {
                editXp(message.author.id, message.guild.id, '+', 2)
            } catch (e) {
                console.log(redBright(`==================\nAuthor: ${message.author.tag} // ${message.author.id}\nAction: Adding Xp\nStack Error:\n${e.stack}\n==================`))
            }
        }
    }

};