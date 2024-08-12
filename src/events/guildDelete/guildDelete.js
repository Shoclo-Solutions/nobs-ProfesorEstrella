/** @param {import('discord.js').Guild} guild */
module.exports = (guild) => {
	console.warn(`Left guild: ${guild.name} (${guild.id})`);
};
