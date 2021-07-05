const Discord = require("discord.js"),
    client = new Discord.Client({
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        ws: { intents: Discord.Intents.ALL}
    }),
    chalk = require('chalk'),
    fs = require('fs')

console.log(chalk.blue(`Status: `) + chalk.magenta(`Starting`));

//command array
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./Bot/commands', (err, files) => {
    if (err) console.error(err);
    console.log(chalk.yellow("\nLoading commands..."))
    files.forEach(f => {
        let props = require(`./commands/${f}`);
        if (props.conf.enabled) {
            try {
                client.commands.set(props.help.name, props);
                props.conf.aliases.forEach(alias => {
                    client.aliases.set(alias, props.help.name);
                });

                /*if (props.slashCommand) {
                    client.api.applications(client.user.id).guilds('680861193879289947').commands.post({
                        data: props.slashCommand
                    })
                }*/

                console.log(`${chalk.green.bold('✓')} Loaded ${props.help.name}`);
            } catch (err) {
                console.log(`${chalk.redBright.bold('✗')} Error in ${props.help.name}`);
                console.log(err)
            }
        }
    });
});

fs.readdir('./Bot/events/', (err, files) => {
    if (err) return console.error;
    console.log(chalk.yellow("\nLoading events..."))
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        let evtName = file.split('.')[0];
        try {
            const evt = require(`./events/${file}`);
            if (evtName.startsWith('ws_')) {
                //client.ws.on(evtName.replace('ws_', ''), evt.bind(null, client));
                console.log(`${chalk.green.bold('✓')} Loaded WS ${evtName}`);
            } else {
                client.on(evtName, evt.bind(null, client));
                console.log(`${chalk.green.bold('✓')} Loaded ${evtName}`);
            }
        } catch (err) {
            console.log(`${chalk.redBright.bold('✗')} Error in ${evtName}`);

        }
    });
});


//login
client.login(config.Bot.Token);

module.exports = client;
// Made by PnsDev.com