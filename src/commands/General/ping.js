module.exports = {
  /** @type {import('commandkit').CommandData}  */
  data: {
    name: "ping",
    description: "Beware.. the pong!",
  },

  /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: ({ interaction, client }) => {
    interaction.reply(`Pong'd at ${client.ws.ping}ms!`);
  },

  /** @type {import('commandkit').CommandOptions} */
  options: {},
};
