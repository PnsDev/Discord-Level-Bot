const Discord = require('discord.js'),
    chalk = require('chalk');

//=======================
// This handles all the
// commands.
//=======================
module.exports = async (client, message) => {

    if (!message.content.startsWith(config.Bot.Prefix) || message.author.bot) return;
    const args = message.content.slice(config.Bot.Prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }



    if (cmd) {
        if (message.guild === null && cmd.help.useInDM === false) return message.channel.send(new Discord.MessageEmbed().setTitle('Woah There!').setDescription(`You can't use this command in a DM!\nPlease use it inside a guild!`).setFooter(`For ${message.author.username}`).setTimestamp().setColor(process.env.BAD_COLOR))
        if (message.guild !== null && cmd.help.useInGuild === false) return message.channel.send(new Discord.MessageEmbed().setTitle('Woah There!').setDescription(`You can't use this command in a guild!\nPlease use it inside a DM!`).setFooter(`For ${message.author.username}`).setTimestamp().setColor(process.env.BAD_COLOR))

        //------------------------------------
        // Parse pings here. Do not encourage
        // as not all commands support pings
        //------------------------------------

        if (message.guild !== null) {
            for (let i = 0; i < args.length; i++) {
                let tempMember = args[i];
                if ((tempMember.startsWith('<@!') || tempMember.startsWith('<@')) && tempMember.endsWith('>')) {
                    try {
                        tempMember = client.guilds.cache.get(message.guild.id).members.cache.get(tempMember.substring(tempMember.startsWith('<@!') ? 3 : 2, tempMember.length - 1));
                        if (tempMember) {
                            args[i] = tempMember;
                            if (tempMember.user.bot) return message.channel.send(new Discord.MessageEmbed().setAuthor('Invalid User').setDescription(`❌ You can not use this command on bots`).setColor(config.Bot.Colors.Bad));
                        }
                    } catch (err) {
                    }
                }
            }
        }


        try {
            cmd.run(client, message, args);
        } catch (e) {
            console.log(chalk.redBright(`==================\nAuthor: ${message.author.tag} // ${message.author.id}\nCommand: ${cmd.help.name}\nStack Error:\n${e.stack}\n==================`))
        }
    }

};