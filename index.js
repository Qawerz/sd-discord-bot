require('dotenv').config()
const {Client, IntentsBitField } = require("discord.js");
const eventHandler = require('./handlers/eventHandler');

const botData = { 
	token: process.env.TOKEN,
	clientId: process.env.CLIENT_ID,
	guildId: process.env.GUILD_ID
}

exports.botData = botData;

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

eventHandler(client);

client.login(process.env.TOKEN)