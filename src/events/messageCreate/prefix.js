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
        // I won't use mentions
        const user = args[0];
        if (!user) return message.reply('You need to mention a user to ban them!');
        
        const [banned, created] = await BannedTable.findOrCreate({
            where: {
                discordId: user,
            },
            defaults: {
                discordId: user,
            }
        }).catch(Error => {
            console.error('There was an error while trying to ban a user:', Error);
        });

        if (!created) return message.reply('That user is already banned!');

        const user_has_comments = await Comment.findOne({
            where: {
                by: user,
            }
        });

        if (!user_has_comments) return message.reply(`User ${user} has no comments to delete but they have been banned.`);

        await Comment.update({
            deletedAt: Date.now(),
        }, {
            where: {
                by: user,
            }
        }).catch(Error => {
            console.error('There was an error while trying to delete comments from a banned user:', Error);
        });

        return message.reply(`Successfully banned user with ID ${user}`);
    } else if (command === 'unban') {
        const user = args[0];
        if (!user) return message.reply('You need to mention a user to unban them!');
        
        const deleted = await BannedTable.destroy({
            where: {
                discordId: user,
            }
        }).catch(Error => {
            console.error('There was an error while trying to unban a user:', Error);
        });

        if (deleted === 0) return message.reply('That user is not banned!');

        // Restore the comments from the user
        await Comment.restore({
            where: {
                by: user,
            }
        }).catch(Error => {
            console.error('There was an error while trying to restore comments from a banned user:', Error);
        })

        return message.reply(`Successfully unbanned user with id ${user}`);
    }
};