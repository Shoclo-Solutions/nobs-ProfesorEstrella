module.exports = {
  /** @type {import('commandkit').CommandData}  */
  data: {
    name: 'tos',
    description: 'Los términos y condiciones del bot.',
  },

  /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: ({ interaction }) => {
    interaction.reply({
      content:
        'Al utilizar este bot, estás de acuerdo con los [Términos y Condiciones](https://www.google.com) del mismo.',
      ephemeral: true,
    });
  },

  /** @type {import('commandkit').CommandOptions} */
  options: {
    deleted: false,
  },
};
