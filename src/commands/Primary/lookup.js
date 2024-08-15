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
    const selectedProfessor = await Professor.findByPk(professorId);
    if (selectedProfessor) {
      const detailEmbed = await createDetailEmbed(selectedProfessor);
      await i.update({ embeds: [detailEmbed], components: [] });
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
      text: 'Reacciona con ✏️ para añadir un comentario o 🔙 para volver a la lista',
    });
  return embed;
};
