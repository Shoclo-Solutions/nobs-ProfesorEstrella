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
const Courses = require('../../models/curso');
const Comments = require('../../models/comentario');
const sequelizeInstance = require('../../utils/database');

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
      components: [row],
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
    await reaction.users.remove(user.id);
  });
};

/**
 * Sets up the button collector.
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
    console.log(`professorId: ${professorId}`); // Debugging log
    const selectedProfessor = await Professor.findByPk(professorId);
    if (selectedProfessor) {
      const detailEmbed = await createDetailEmbed(selectedProfessor);
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`add_comment_${professorId}`)
          .setLabel('Añadir comentario')
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId('go_back')
          .setLabel('Volver a la lista')
          .setStyle(2)
      );
      await i.update({ embeds: [detailEmbed], components: [actionRow] });
    }
  });

  const actionButtonFilter = (i) =>
    (i.customId.startsWith('add_comment_') || i.customId === 'go_back') &&
    i.user.id === commandInteraction.user.id;
  const actionButtonCollector = embedMessage.createMessageComponentCollector({
    filter: actionButtonFilter,
    time: 60000,
  });

  actionButtonCollector.on('collect', async (i) => {
    try {
      if (i.customId.startsWith('add_comment_')) {
        const professorId = i.customId.split('_')[2];
        const selectedProfessor = await Professor.findByPk(professorId);
        if (selectedProfessor) {
          await handleAddComment(i, selectedProfessor);
        }
      } else if (i.customId === 'go_back') {
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
  const courses = await Courses.findAll({
    where: {
      professorId: professor.id,
    },
  });

  const coursesNames = courses.map((course) => course.name).join(', ') || 'N/A';

  const embed = new EmbedBuilder()
    .setTitle(professor.fullname)
    .setDescription(`Detalles del profesor ${professor.fullname}`)
    .addFields(
      { name: 'Nombre Completo', value: professor.fullname || 'N/A' },
      { name: 'Contrato', value: professor.contract || 'N/A' },
      { name: 'Correo institucional', value: professor.email || 'N/A' },
      {
        name: 'Cursos',
        value: coursesNames,
      },
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
 * Handles adding a comment.
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

  const commentInput = new TextInputBuilder()
    .setCustomId('commentInput')
    .setPlaceholder('Comentario')
    .setLabel('Comentario')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  // Create action rows for each input
  const ratingRow = new ActionRowBuilder().addComponents(ratingInput);
  const commentRow = new ActionRowBuilder().addComponents(commentInput);

  // Add action rows to the modal
  modal.addComponents(ratingRow, commentRow);

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
    const rating = interaction.fields.getTextInputValue('ratingInput');
    if (
      isNaN(rating) ||
      rating < 1 ||
      rating > 5 ||
      !Number.isInteger(+rating)
    ) {
      return interaction.reply({
        content: 'Error: La calificación debe ser un número entre 1 y 5.',
        ephemeral: true,
      });
    }
    const comment = interaction.fields.getTextInputValue('commentInput');

    // Create a new comment and associate it with the selected professor
    await Comments.create(
      {
        by: interaction.user.id,
        content: comment,
        rating: rating,
        professorId: toString(selectedProfessor.id),
      },
      { validate: true }
    );

    return interaction.reply({
      content: 'Comentario añadido con éxito!',
      ephemeral: true,
    });
  } catch (error) {
    console.error(`There was an error saving the comment: ${error}`);
    return interaction.reply({
      content:
        'Hubo un error al guardar el comentario. Por favor, inténtalo de nuevo.',
      ephemeral: true,
    });
  }
};
