const { Op } = require('sequelize');
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const Professor = require('../../models/profesor');
const Comments = require('../../models/comentario');

module.exports = {
  /** @type {import('commandkit').CommandData}  */
  data: {
    name: 'lookup',
    description: 'Busca a un profesor en la base de datos.',
    options: [
      {
        name: 'profesor',
        description: 'Nombre(s) y/o apellido(s) del profesor a buscar.',
        type: 3,
        required: true,
      },
    ],
  },

  /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction, client }) => {
    const paramProfe = interaction.options.getString('profesor');
    const pageSize = 4;
    let page = 1;

    const { professors, count } = await fetchProfessors(
      paramProfe,
      page,
      pageSize
    );
    const totalPages = Math.ceil(count / pageSize);

    const { embed, row } = createEmbed(
      professors,
      paramProfe,
      page,
      totalPages
    );

    const embedMessage = await interaction.reply({
      embeds: [embed],
      components: row ? [row] : [],
      fetchReply: true,
    });

    if (totalPages > 1) {
      await addPaginationReactions(embedMessage);
      setupPaginationCollector(
        embedMessage,
        paramProfe,
        page,
        totalPages,
        pageSize
      );
    }

    setupButtonCollector(embedMessage, interaction);
  },

  /** @type {import('commandkit').CommandOptions} */
  options: {
    botPermissions: [
      'SendMessages',
      'EmbedLinks',
      'AddReactions',
      'ManageMessages',
    ],
  },
};

/**
 * Fetches professors from the database according to the search term and page number.
 * @param {string} paramProfe
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ professors: Professor[], count: number }>}
 */
const fetchProfessors = async (paramProfe, page, pageSize) => {
  const offset = (page - 1) * pageSize;
  const { rows: professors, count } = await Professor.findAndCountAll({
    where: {
      fullname: {
        [Op.like]: `%${paramProfe}%`,
      },
    },
    limit: pageSize,
    offset: offset,
  });
  return { professors, count };
};

/**
 * Creates an embed with the list of professors.
 * @param {Professor[]} professors
 * @param {string} paramProfe
 * @param {number} page
 * @param {number} totalPages
 * @returns {{ embed: import('discord.js').EmbedBuilder, row: import('discord.js').ActionRowBuilder }}
 */
const createEmbed = (professors, paramProfe, page, totalPages) => {
  const embed = new EmbedBuilder()
    .setTitle(`Resultados para ${paramProfe}`)
    .setDescription(
      professors.map((prof) => prof.fullname).join('\n') ||
        'No se encontraron resultados.'
    )
    .setColor('Blue')
    .setTimestamp()
    .setFooter({ text: `Página ${page} de ${totalPages}` });

  if (professors.length === 0) {
    return { embed, row: null };
  }

  const buttons = professors.map((prof) =>
    new ButtonBuilder()
      .setCustomId(`prof_${prof.id}`)
      .setLabel(prof.fullname)
      .setStyle(1)
      .setEmoji('🧑‍🏫')
  );

  const row = new ActionRowBuilder().addComponents(buttons);

  return { embed, row };
};

/**
 * Adds pagination reactions to the message.
 * @param {import('discord.js').Message} embedMessage
 */
const addPaginationReactions = async (embedMessage) => {
  await embedMessage.react('⬅️');
  await embedMessage.react('➡️');
};

/**
 * Sets up the pagination collector.
 * @param {import('discord.js').Message} embedMessage
 * @param {string} paramProfe
 * @param {number} page
 * @param {number} totalPages
 * @param {number} pageSize
 */
const setupPaginationCollector = (
  embedMessage,
  paramProfe,
  page,
  totalPages,
  pageSize
) => {
  const filter = (reaction, user) => {
    return ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
  };

  const collector = embedMessage.createReactionCollector({
    filter,
    time: 60000,
  });

  collector.on('collect', async (reaction, user) => {
    if (reaction.emoji.name === '⬅️' && page > 1) {
      page--;
    } else if (reaction.emoji.name === '➡️' && page < totalPages) {
      page++;
    }

    const { professors } = await fetchProfessors(paramProfe, page, pageSize);
    const { embed, row } = createEmbed(
      professors,
      paramProfe,
      page,
      totalPages
    );
    await embedMessage.edit({
      embeds: [embed],
      components: [row],
    });
  });

  collector.on('end', async () => {
    await embedMessage.reactions.removeAll().catch(() => {});
  });
};

/**
 * Sets up the button collector. Executes different actions based on the button pressed.
 * @param {import('discord.js').Message} embedMessage
 * @param {import('commandkit').SlashCommandProps} commandInteraction
 */
const setupButtonCollector = (embedMessage, commandInteraction) => {
  const buttonFilter = (i) =>
    i.customId.startsWith('prof_') && i.user.id === commandInteraction.user.id;
  const buttonCollector = embedMessage.createMessageComponentCollector({
    filter: buttonFilter,
    time: 60000,
  });

  buttonCollector.on('collect', async (i) => {
    const professorId = i.customId.split('_')[1];
    const selectedProfessor = await Professor.findByPk(professorId);
    if (selectedProfessor) {
      const detailEmbed = await createDetailEmbed(selectedProfessor);
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`add_comment_${professorId}`)
          .setLabel('Añadir comentario')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId(`view_comments_of_${professorId}_1`)
          .setLabel('Ver comentarios')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('go_back')
          .setLabel('Volver a la lista')
          .setStyle(2)
      );
      await i.update({ embeds: [detailEmbed], components: [actionRow] });
    }
  });

  // Filter for the action buttons (add comment, view comments, go back)
  const actionButtonFilter = (i) =>
    (i.customId.startsWith('add_comment_') ||
      i.customId === 'go_back' ||
      i.customId.startsWith('view_comments_of_')) &&
    i.user.id === commandInteraction.user.id;
  const actionButtonCollector = embedMessage.createMessageComponentCollector({
    filter: actionButtonFilter,
    time: 60000,
  });

  actionButtonCollector.on('collect', async (i) => {
    try {
      if (i.customId.startsWith('add_comment_')) {
        await embedMessage.reactions.removeAll().catch(() => {});
        const professorId = i.customId.split('_')[2];
        const selectedProfessor = await Professor.findByPk(professorId);
        if (selectedProfessor) {
          await handleAddComment(i, selectedProfessor);
        }
      } else if (i.customId.startsWith('view_comments_of_')) {
        // Remove all reactions from the message
        await embedMessage.reactions.removeAll().catch(() => {});
        const professorId = i.customId.split('_')[3];
        const pageStr = i.customId.split('_')[4];
        const page = parseInt(pageStr, 10);
        console.log(page);
        const pageSize = 5;
        const selectedProfessor = await Professor.findByPk(professorId);
        if (selectedProfessor) {
          const comments = await Comments.findAll({
            where: {
              professorId: professorId,
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
          });

          const commentsText = comments
            .map((comment) => {
              const coursesText =
                comment.courses && comment.courses.length > 0
                  ? `En: ${comment.courses}\n`
                  : '';
              return `${comment.rating} ⭐\n${coursesText}${comment.content}`;
            })
            .join('\n\n');

          const commentsEmbed = new EmbedBuilder()
            .setTitle(`Comentarios sobre ${selectedProfessor.fullname}`)
            .setDescription(commentsText || 'No hay comentarios aún.')
            .setColor('Green')
            .setTimestamp()
            .setFooter({
              text: 'Añade un comentario usando el botón de abajo.',
            });

          const totalComments = await Comments.count({
            where: {
              professorId: professorId,
            },
          });

          const totalPages = Math.ceil(totalComments / pageSize);

          const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`add_comment_${professorId}`)
              .setLabel('Añadir comentario')
              .setStyle(1),
            new ButtonBuilder()
              .setCustomId(`view_comments_of_${professorId}_${page - 1}`)
              .setLabel('Anterior')
              .setStyle(1)
              .setDisabled(page <= 1),
            new ButtonBuilder()
              .setCustomId(`view_comments_of_${professorId}_${page + 1}`)
              .setLabel('Siguiente página')
              .setStyle(1)
              .setDisabled(page >= totalPages),
            new ButtonBuilder()
              .setCustomId('go_back')
              .setLabel('Volver a la lista')
              .setStyle(2)
          );

          await i.update({ embeds: [commentsEmbed], components: [actionRow] });
        }
      } else if (i.customId === 'go_back') {
        // Reapply the pagination reactions
        await addPaginationReactions(embedMessage);
        const paramProfe = commandInteraction.options.getString('profesor');
        const pageSize = 4;
        let page = 1;

        const { professors, count } = await fetchProfessors(
          paramProfe,
          page,
          pageSize
        );
        const totalPages = Math.ceil(count / pageSize);

        const { embed, row } = createEmbed(
          professors,
          paramProfe,
          page,
          totalPages
        );

        await i.update({ embeds: [embed], components: [row] });
      }
    } catch (error) {
      console.error(`Error handling button interaction: ${error}`);
      await i.reply({
        content: 'Hubo un error al procesar tu solicitud.',
        ephemeral: true,
      });
    }
  });
};

/**
 * Creates a detailed embed for a professor.
 * @param {Professor} professor
 * @returns {Promise<import('discord.js').EmbedBuilder>}
 */
const createDetailEmbed = async (professor) => {
  const embed = new EmbedBuilder()
    .setTitle(professor.fullname)
    .setDescription(`Detalles del profesor ${professor.fullname}`)
    .addFields(
      { name: 'Nombre Completo', value: professor.fullname || 'N/A' },
      { name: 'Contrato', value: professor.contract || 'N/A' },
      {
        name: 'Calificación Promedio',
        value: professor.averageRating?.toString() || 'N/A',
      }
    )
    .setColor('Green')
    .setTimestamp()
    .setFooter({
      text: 'Añade un comentario usando el botón de abajo.',
    });
  return embed;
};

/**
 * Handles the components in the modal to add a comment.
 * @param {import('discord.js').MessageComponentInteraction} interaction
 * @param {Professor} selectedProfessor
 */
const handleAddComment = async (interaction, selectedProfessor) => {
  const modal = new ModalBuilder()
    .setCustomId('commentModal')
    .setTitle('Añadir comentario');

  const ratingInput = new TextInputBuilder()
    .setCustomId('ratingInput')
    .setPlaceholder('Calificación')
    .setLabel('Calificación (1-5)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const courseInput = new TextInputBuilder()
    .setCustomId('courseInput')
    .setPlaceholder('Curso(s) con los que has tenido al profesor')
    .setLabel('Curso')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const commentInput = new TextInputBuilder()
    .setCustomId('commentInput')
    .setPlaceholder('Comentario')
    .setLabel('Comentario')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  // Create action rows for each input
  const ratingRow = new ActionRowBuilder().addComponents(ratingInput);
  const courseRow = new ActionRowBuilder().addComponents(courseInput);
  const commentRow = new ActionRowBuilder().addComponents(commentInput);

  // Add action rows to the modal
  modal.addComponents(ratingRow, commentRow, courseRow);

  await interaction.showModal(modal);

  interaction
    .awaitModalSubmit({
      time: 60000,
      filter: (i) => i.customId === 'commentModal',
    })
    .then((i) => handleCommentSubmit(i, selectedProfessor))
    .catch((err) => {
      console.error(`There was an error handling the comment submit: ${err}`);
    });
};

/**
 * Handles the comment submission.
 * @param {import('discord.js').ModalMessageModalSubmitInteraction} interaction
 * @param {Professor} selectedProfessor
 */
const handleCommentSubmit = async (interaction, selectedProfessor) => {
  try {
    const modalRatingInput =
      interaction.fields.getTextInputValue('ratingInput');
    if (
      isNaN(modalRatingInput) ||
      modalRatingInput < 1 ||
      modalRatingInput > 5 ||
      !Number.isInteger(+modalRatingInput)
    ) {
      return interaction.reply({
        content: 'Error: La calificación debe ser un número entre 1 y 5.',
        ephemeral: true,
      });
    }
    const modalCommentInput =
      interaction.fields.getTextInputValue('commentInput');

    const modalCourseInput =
      interaction.fields.getTextInputValue('courseInput');

    // TODO: Check if courses are uni courses
    if (Number.isInteger(modalCourseInput)) {
      return interaction.reply({
        content: 'Error: El curso no puede ser un número.',
        ephemeral: true,
      });
    }

    const professorId = selectedProfessor.id;

    // Create a new comment and associate it with the selected professor
    // Look if the user has already commented the same content on the professor
    const [newComment, created] = await Comments.findOrCreate({
      where: {
        by: interaction.user.id,
        content: modalCommentInput,
        courses: modalCourseInput ? modalCourseInput : null,
        professorId: professorId,
      },
    });

    if (!created) {
      return interaction.reply({
        content: 'Ya has añadido un comentario con el mismo contenido.',
        ephemeral: true,
      });
    } else {
      await newComment.update({
        modalRatingInput: modalRatingInput,
      });
    }

    // Check for the recently added comment
    const comments = await Comments.findAll({
      where: {
        by: interaction.user.id,
        professorId: professorId,
      },
    });

    if (comments.length === 0) {
      return interaction.reply({
        content:
          'Tu comentario fue guardado de manera exitosa, pero no se encontró en la base de datos. Por favor, contacta al desarrollador.',
        ephemeral: true,
      });
    } else {
      return interaction.reply({
        content: 'Comentario añadido con éxito!',
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(`There was an error saving the comment: ${error}`);
    return interaction.reply({
      content:
        'Hubo un error al guardar el comentario. Por favor, inténtalo de nuevo.',
      ephemeral: true,
    });
  }
};
