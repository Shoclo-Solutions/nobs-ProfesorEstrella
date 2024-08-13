<<<<<<< HEAD
const { Op } = require('sequelize');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Professor = require('../../models/profesor');
=======
const { Op } = require("sequelize");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Professor = require("../../models/profesor");
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb

module.exports = {
  /** @type {import('commandkit').CommandData}  */
  data: {
    name: "lookup",
    description: "Busca a un profesor en la base de datos.",
    options: [
      {
        name: "profesor",
        description: "Nombre(s) y/o apellido(s) del profesor a buscar.",
        type: 3,
        required: true,
      },
    ],
  },

  /**
   * @param {import('commandkit').SlashCommandProps} param0
   */
  run: async ({ interaction }) => {
    /** @type {String} */
    const professor = interaction.options.getString('profesor');
    const pageSize = 4;
    let page = 1;

    /**
     * @param {number} page
     * @returns {Promise<{ professors: Professor[], count: number }>}
     */
    const fetchProfessors = async (page) => {
      const offset = (page - 1) * pageSize;
      const { rows: professors, count } = await Professor.findAndCountAll({
        where: {
          fullname: {
            [Op.like]: `%${professor}%`,
          },
        },
        limit: pageSize,
        offset: offset,
      });
      return { professors, count };
    };

    /**
     * @param {Professor[]} professors
     * @param {number} page
     * @param {number} totalPages
     * @returns {{ embed: import('discord.js').MessageEmbed, row: import('discord.js').MessageActionRow }}
     */
    const createEmbed = (professors, page, totalPages) => {
      const embed = new EmbedBuilder()
        .setTitle(`Resultados para ${professor}`)
        .setDescription(
<<<<<<< HEAD
          professors.map((prof) => prof.fullname).join('\n') ||
            'No se encontraron resultados.'
        )
        .setColor('Blue')
=======
          professors.map((prof) => prof.fullname).join("\n") ||
            "No se encontraron resultados."
        )
        .setColor("Blue")
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
        .setTimestamp()
        .setFooter({ text: `Página ${page} de ${totalPages}` });

      const buttons = professors.map((prof, index) =>
        new ButtonBuilder()
          .setCustomId(`prof_${prof.id}`)
          .setLabel(prof.fullname)
          .setStyle(1)
<<<<<<< HEAD
          .setEmoji('🧑‍🏫')
=======
          .setEmoji("🧑‍🏫")
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
      );

      const row = new ActionRowBuilder().addComponents(buttons);

      return { embed, row };
    };

    /**
     * @param {Professor} professor
     * @returns {import('discord.js').MessageEmbed}
     */
    const createDetailEmbed = (professor) => {
      const embed = new EmbedBuilder()
        .setTitle(professor.fullname)
        .setDescription(`Detalles del profesor ${professor.fullname}`)
<<<<<<< HEAD
        .addFields(
          { name: 'Nombre Completo', value: professor.fullname || 'N/A' },
          { name: 'Contrato', value: professor.contract || 'N/A' },
          { name: 'Correo institucional', value: professor.email || 'N/A' },
          {
            name: 'Cursos',
            value:
              professor.courses.map((course) => course.name).join('\n') ||
              'N/A',
          },
          {
            name: 'Calificación Promedio',
            value: professor.averageRating?.toString() || 'N/A',
          }
        )
        .setColor('Green')
=======
        .addFields({ name: "Nombre Completo", value: professor.fullname })
        .setColor("Green")
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
        .setTimestamp();
      return embed;
    };

    const { professors, count } = await fetchProfessors(page);
    const totalPages = Math.ceil(count / pageSize);

    const { embed, row } = createEmbed(professors, page, totalPages);

    const embedMessage = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    if (totalPages > 1) {
<<<<<<< HEAD
      await embedMessage.react('⬅️');
      await embedMessage.react('➡️');

      const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
=======
      await embedMessage.react("⬅️");
      await embedMessage.react("➡️");

      const filter = (reaction, user) => {
        return ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot;
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
      };

      const collector = embedMessage.createReactionCollector({
        filter,
        time: 60000,
      });

<<<<<<< HEAD
      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '⬅️' && page > 1) {
          page--;
        } else if (reaction.emoji.name === '➡️' && page < totalPages) {
=======
      collector.on("collect", async (reaction, user) => {
        if (reaction.emoji.name === "⬅️" && page > 1) {
          page--;
        } else if (reaction.emoji.name === "➡️" && page < totalPages) {
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
          page++;
        }

        const { professors } = await fetchProfessors(page);
        const { embed, row } = createEmbed(professors, page, totalPages);
        await embedMessage.edit({
          embeds: [embed],
          components: [row],
        });
        await reaction.users.remove(user.id);
      });
    }

    const buttonFilter = (i) =>
<<<<<<< HEAD
      i.customId.startsWith('prof_') && i.user.id === interaction.user.id;
=======
      i.customId.startsWith("prof_") && i.user.id === interaction.user.id;
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
    const buttonCollector = embedMessage.createMessageComponentCollector({
      filter: buttonFilter,
      time: 60000,
    });

<<<<<<< HEAD
    buttonCollector.on('collect', async (i) => {
      const professorId = i.customId.split('_')[1];
=======
    buttonCollector.on("collect", async (i) => {
      const professorId = i.customId.split("_")[1];
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
      const selectedProfessor = await Professor.findByPk(professorId);
      if (selectedProfessor) {
        const detailEmbed = createDetailEmbed(selectedProfessor);
        await i.update({ embeds: [detailEmbed], components: [] });
      }
    });
  },

  /** @type {import('commandkit').CommandOptions} */
  options: {
    botPermissions: [
<<<<<<< HEAD
      'SendMessages',
      'EmbedLinks',
      'AddReactions',
      'ManageMessages',
=======
      "SendMessages",
      "EmbedLinks",
      "AddReactions",
      "ManageMessages",
>>>>>>> c9e488de33396ec30513d2b0580abd32f78169eb
    ],
  },
};
