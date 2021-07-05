global.config = require('./config.json');
const mongoose = require('mongoose'), {greenBright, redBright} = require('chalk')

/**
 * This is the mongoDB connection.
 *
 * If it doesn't connect then the whole
 * bot system should not work. This is
 * why the require is inside the connect event.
 */

mongoose.connect(`mongodb://${config.MongoDB.User !== '' ? `${config.MongoDB.User}:${config.MongoDB.Pass}@` : ''}${config.MongoDB.Host}:${config.MongoDB.Port}/DiscordLevelBot?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('connected', () => {
    require('./Bot/index')

});

mongoose.connection.on('connected', () => console.log(greenBright('MongoDB connection established!')));
mongoose.connection.on('disconnected', () => console.log(redBright('MongoDB connection went oop!')));