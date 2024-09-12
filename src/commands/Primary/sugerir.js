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
    ],
  },

  /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction, client }) => {
    const filesize =
      interaction.options.get('Archivo de prueba').attachment.size;
    const filetype =
      interaction.options.get('Archivo de prueba').attachment.contentType;
    if (filesize > MAX_FILE_SIZE) {
      return interaction.reply({
        content: 'El archivo es demasiado grande.',
        ephemeral: true,
      });
    }
    if (
      filetype !== 'application/vnd.ms-powerpoint' &&
      filetype !== 'image/jpeg'
    ) {
      return interaction.reply({
        content: 'El archivo debe ser un PPT o JPEG/JPG.',
        ephemeral: true,
      });
    }
  },
};
