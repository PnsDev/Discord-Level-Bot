const {blue, greenBright} = require('chalk')

module.exports = async (client, guildMember) => {
	console.log("\n" + blue(`Status: `) + greenBright(`Online`));
};