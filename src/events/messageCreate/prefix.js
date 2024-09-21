require('dotenv/config');
const BannedTable = require('../../models/banned');
const Comment = require('../../models/comentario');

/** @param {import('discord.js').Message} message */
module.exports = async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('¬')) return;
    if (message.author.id !== process.env.DEV_ID1) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Prefix command logic
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

        const user_has_comments = await Comment.findOne({
            where: {
                by: user.id,
            }
        });

        if (!user_has_comments) return message.reply('That user has no comments to delete. They have been banned.');

        await Comment.update({
            deletedAt: Date.now(),
        }, {
            where: {
                by: user.id,
            }
        })

        return message.reply(`Successfully banned ${user.tag}`);
    } else if (command === 'unban') {
        const user = message.mentions.users.first();
        if (!user) return message.reply('You need to mention a user to unban them!');
        
        const deleted = await BannedTable.destroy({
            where: {
                discordId: user.id,
            }
        });

        if (deleted === 0) return message.reply('That user is not banned!');

        return message.reply(`Successfully unbanned ${user.tag}`);
    }
};