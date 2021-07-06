const {blue, greenBright, cyanBright} = require('chalk'), {getCache, setVcJoin} = require('../../interfaces/vcInterface')

module.exports = async (client) => {
	console.log("\n" + blue(`Status: `) + greenBright(`Online`));

	/**
	 * Registers all members into
	 * the voice chat XP system
	 */
	let vcCache = getCache();
	let stats = {
		guilds: 0,
		channels: 0,
		members: 0
	}
	client.guilds.cache.forEach(guild => {
		if (!vcCache[guild.id]) vcCache[guild.id] = {}; // Avoid errors
		guild.channels.cache.filter((c) => c.type === "voice").forEach((voiceChannel) => {
			voiceChannel.members.forEach((x) => {
				if (!vcCache[guild.id][x.id]) setVcJoin(x.id, guild.id, Date.now())
				stats.members++;
			})
			stats.channels++;
		})
		stats.guilds++;
	})
	console.log(cyanBright(`Done registering vc channels in cache!\nGuilds: ${stats.guilds}\nVoice Channels: ${stats.channels}\nMembers: ${stats.members}`))
};