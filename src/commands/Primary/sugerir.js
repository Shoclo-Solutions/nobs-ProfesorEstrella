require('dotenv/config');
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

module.exports = {
  /** @type {import('commandkit').CommandData}  */
  data: {
    name: 'sugerir',
    description:
      'Sugiere a un profesor que no se encuentre en los resultados de búsqueda.',
    options: [
      {
        name: 'evidencia',
        description: 'Archivo PPT o jpeg/jpg con la presentación del profesor.',
        type: 11,
        required: true,
      },
      {
        name: 'razon',
        description: 'Razón por la que se sugiere al profesor.',
        type: 3,
        required: true,
        min_length: 10,
        max_length: 200,
      },
    ],
  },

  /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction, client }) => {
    const file = interaction.options.get('evidencia')
      ? interaction.options.get('evidencia')
      : null;
    if (!file) {
      return interaction.reply({
        content: 'Se ha enviado un archivo inválido.',
        ephemeral: true,
      });
    }
    const filesize = file.attachment.size;
    const filetype = file.attachment.contentType;
    if (filesize > MAX_FILE_SIZE) {
      return interaction.reply({
        content: 'El archivo es demasiado grande.',
        ephemeral: true,
      });
    }
    if (
      filetype !== 'application/vnd.ms-powerpoint' &&
      filetype !== 'image/jpeg' &&
      filetype !== 'image/png'
    ) {
      return interaction.reply({
        content: 'El archivo debe ser un PPT o JPEG/JPG.',
        ephemeral: true,
      });
    }

    await client.channels
      .fetch(process.env.SUGGESTION_CHANNEL)
      .then((channel) => {
        channel.send({
          content: `Sugerencia de ${interaction.user.id}. La razón fue: ${interaction.options.getString('razon')}`,
          files: [file.attachment],
        });
      })
      .finally(() => {
        interaction.reply({
          content: 'Sugerencia enviada.',
          ephemeral: true,
        });
      })
      .catch((error) => {
        console.error(`Hubo un error al enviar la sugerencia: ${error}`);
        return interaction.reply({
          content: 'No se pudo enviar la sugerencia.',
          ephemeral: true,
        });
      });
  },
};
