const { EmbedBuilder } = require('discord.js');

const embed = new EmbedBuilder()
  .setTitle('Hola! 👋')
  .setDescription(
    '¡Gracias por invitarme al server! Tengo toda la información necesaria para poder empezar a calificar a tus profes preferidos. Recuerda que puedes ver la lista de comandos con `/help` y que al utilizar este bot, estás de acuerdo con los `/TOS`.'
  )
  .setColor('Random')
  .setTimestamp();

/** @param {import('discord.js').Guild} guild */
module.exports = (guild) => {
  console.log(`Joined guild: ${guild.name}`);
  if (guild.systemChannel) {
    return guild.systemChannel.send({ embeds: [embed] });
  }

  /** * @type {import('discord.js').TextChannel} */
  const channel = guild.channels.cache.find(
    (channel) => channel.type == 'GUILD_TEXT'
  );
  if (
    channel &&
    channel.permissionsFor(guild.members.me).has('SEND_MESSAGES')
  ) {
    channel.send({ embeds: [embed] });
  } else {
    /** @type {import('discord.js').GuildMember} */
    const owner = guild.fetchOwner().catch((error) => {
      logger.error(`Error while fetching owner: ${error}`);
    });
    owner.send({ embeds: [embed] });
  }
};
