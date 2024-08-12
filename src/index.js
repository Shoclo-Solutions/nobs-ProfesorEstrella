require('dotenv/config');

const { Client, IntentsBitField } = require('discord.js');
const { CommandKit } = require('commandkit');

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.DirectMessageReactions,
	],
});

new CommandKit({
	client,
	eventsPath: `${__dirname}/events`,
	commandsPath: `${__dirname}/commands`,
	devUserIds: [process.env.DEV_ID1],
	devGuildIds: [process.env.DEV_GUILD_ID1],
});

client.login(process.env.TOKEN);
