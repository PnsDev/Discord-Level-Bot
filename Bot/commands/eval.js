const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (
        args[0] === undefined ||
        (message.author.id !== "291696653008896000" &&
            message.author.id !== "197712838582730752")
    )
        return;
    message.reply(
        new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL())
            .addField("📥 Input", "```" + message.content + "```")
            .addField("📤 Output", "```" + eval(args.join(" ")) + "```")
    );
};


exports.conf = {
    enabled: true,
    aliases: []
};

exports.help = {
    name: 'eval',
    useInGuild: true,
    useInDM: true,
    description: 'Eval command',
    usage: 'eval <something cool here>'
};
