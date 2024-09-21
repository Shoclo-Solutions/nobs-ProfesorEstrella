require('dotenv/config');
const BannedTable = require('../../models/banned');

/** @param {import('discord.js').Message} message */
module.exports = async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('¬')) return;
    if (message.author.id !== process.env.DEV_ID1) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ban') {
        const user = message.mentions.users.first();
        if (!user) return message.reply('You need to mention a user to ban them!');
        const member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('That user is not in this server!');
        
        const [banned, created] = await BannedTable.findOrCreate({
            where: {
                discordId: user.id,
            },
            defaults: {
                discordId: user.id,
            }
        });

        if (!created) return message.reply('That user is already banned!');

        message.reply(`Successfully banned ${user.tag}`);
    }
};