const { Op } = require('sequelize');
const { EmbedBuilder } = require('discord.js');
const Professor = require('../../models/profesor');

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
	run: async ({ interaction }) => {
		/** @type {String} */
		const professor = interaction.options.getString('profesor');
		const pageSize = 5;
		let page = 1;

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

		const createEmbed = (professors, page, totalPages) => {
			const embed = new EmbedBuilder()
				.setTitle(`Resultados para ${professor}`)
				.setDescription(
					professors.map((prof) => prof.fullname).join('\n') ||
						'No se encontraron resultados.'
				)
				.setColor('DarkRed')
				.setTimestamp()
				.setFooter({ text: `Página ${page} de ${totalPages}` });
			return embed;
		};

		const { professors, count } = await fetchProfessors(page);
		const totalPages = Math.ceil(count / pageSize);

		const embedMessage = await interaction.reply({
			embeds: [createEmbed(professors, page, totalPages)],
			fetchReply: true,
		});

		if (totalPages > 1) {
			await embedMessage.react('⬅️');
			await embedMessage.react('➡️');

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

				const { professors } = await fetchProfessors(page);
				await embedMessage.edit({
					embeds: [createEmbed(professors, page, totalPages)],
				});
				await reaction.users.remove(user.id);
			});
		}
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
