const {MessageEmbed, MessageAttachment, GuildMember} = require('discord.js'),
    Canvas = require("canvas"), {numberFormat} = require('../../utils/utils'),
    {getXp, calculateLevel} = require('../../utils/xpInterface')

Canvas.registerFont("./resources/fonts/MyFont-Regular.otf", {
    family: "poppinFont",
});

const Badges = {
    BUGHUNTER_LEVEL_1: 'bug_hunter_badge',
    BUGHUNTER_LEVEL_2: 'bug_buster_badge',
    DISCORD_EMPLOYEE: 'staff_badge',
    DISCORD_NITRO: 'nitro_badge',
    DISCORD_PARTNER: 'partner_badge',
    EARLY_SUPPORTER: 'early_supporter_badge',
    HYPESQUAD_EVENTS: 'hypesquad_events_badge',
    VERIFIED_DEVELOPER: 'verified_developer_badge'
}

module.exports.run = async (client, message, args) => {
    if (!(args[0] instanceof GuildMember)) {
        if (args[0] !== undefined) return message.reply(new MessageEmbed().setColor(config.Bot.Colors.Bad).setAuthor('Invalid Member').setDescription('The member specified is not valid!\nTry again by @ing someone'))
        args[0] = message.member;
    }

    const memberData = calculateLevel(await getXp(args[0].id, args[0].guild.id));
    const newMsg = await message.reply((new MessageAttachment(await makeImage(), `${args[0].user.username}.png`)));


    async function makeImage() {
        const canvas = Canvas.createCanvas(814, 197), ctx = canvas.getContext("2d");

        let resources = {
            xpBar: await Canvas.loadImage('./resources/xpBar.png'),
            overlay: await Canvas.loadImage('./resources/overlay.png'),
            badges: await (await getBadges(args[0].user))
        }
        for (let i = 0; i < resources.badges.length; i++) {
            resources.badges[i] = await Canvas.loadImage(`./resources/badges/${resources.badges[i]}.png`);
        }

        ctx.clearRect(0, 0, canvas.length, canvas.height) //Clear Canvas
        ctx.fillStyle = '#626262';
        ctx.fillRect(216, 137.2, resources.xpBar.width + 2, resources.xpBar.height + 2);
        ctx.drawImage(resources.xpBar, 216 - (resources.xpBar.width * (1 - (memberData.leftOverXp / memberData.nextLevel))), 137.2)
        ctx.clearRect(0, 0, 13, canvas.height) //Overlap Issue Fix
        /**
         * Profile Picture
         */
        try {
            const avatar = await Canvas.loadImage(args[0].user.displayAvatarURL({format: 'png', size: 256}));
            ctx.fillRect(26, 21.9, 153, 153);
            ctx.drawImage(avatar, 26, 21.9, 153, 153)
        } catch (e) {
            return e;
        }
        /**
         * Overlay Base
         */
        ctx.drawImage(resources.overlay, 0, 0)
        /**
         * Username and Identifier
         */
        changeFontAndColor(`bold 40px poppinFont`, '#FFFFFF')
        //ctx.fillText(args[0].user.username, 232, 67.2);
        let textLength = writeWithSpacing(args[0].user.username, -1, 232, 67.2) //ctx.measureText(args[0].user.username);
        changeFontAndColor(`24px poppinFont`, '#626262')
        ctx.fillText('#' + args[0].user.discriminator, 240 + textLength, 67.2);
        /**
         * XP Progress & Bar
         */
        ctx.textAlign = 'right';
        ctx.fillText(`/${numberFormat(memberData.nextLevel)} XP`, 784, 122.6);
        textLength = ctx.measureText(`/${numberFormat(memberData.nextLevel)} XP`);
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(numberFormat(memberData.leftOverXp), 784 - textLength.width, 122.6);
        ctx.font = `55px poppinFont`;
        ctx.fillText(numberFormat(memberData.level), 784, 73.3);
        textLength = ctx.measureText(numberFormat(memberData.level));
        changeFontAndColor(`40px poppinFont`, '#626262')
        ctx.fillText('Lv.', 784 - textLength.width - 10, 73.3);

        let count = 232
        ctx.textAlign = 'left';
        for (let i = 0; i < resources.badges.length; i++) {
            if (i <= 4) {
                ctx.drawImage(resources.badges[i], count, 85, 40, 40)
                count += 43;
            }
        }

        ctx.fillStyle = "#090A0B";
        ctx.beginPath();
        ctx.arc(159, 145, 22, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath()
        ctx.fillStyle = args[0].user.presence.status === 'online' ? '#3BA55D' : args[0].user.presence.status === 'idle' ? '#FAA81A' : args[0].user.presence.status === 'dnd' ? '#EC4245' : '#747F8D';
        ctx.beginPath();
        ctx.arc(159, 145, 18, 0, 2 * Math.PI, false);
        ctx.fill();

        return canvas.toBuffer();

        function changeFontAndColor(font, color) {
            ctx.font = font;
            ctx.fillStyle = color;
        }

        async function getBadges(user) {
            let Flags = (await args[0].user.fetchFlags()).toArray();
            let flags = Flags.filter(b => !!Badges[b]).map(m => Badges[m]);
            if (user.avatar && user.avatar.startsWith('a_')) {
                flags.push(Badges['DISCORD_NITRO']);
            }
            return flags;
        }

        function writeWithSpacing(text, spacingPx, x, y){
            let startingX = x;
            text = text.split('');
            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], x, y);
                x += ctx.measureText(text[i]).width + spacingPx;
            }
            return x - startingX;
        }
    }
};


exports.conf = {
    enabled: true,
    aliases: ['l', 'profile']
};

exports.help = {
    name: 'level',
    useInGuild: true,
    useInDM: true,
    description: 'Displays the level and xp of the member',
    usage: 'level [@user]'
};
