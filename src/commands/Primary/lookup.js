const { Op } = require('sequelize');
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
	run: ({ interaction, client }) => {
		/** @type {String} */
		const professor = interaction.options.getString('profesor');
		interaction
			.reply({ content: `Buscando a ${professor}...`, ephemeral: true })
			.then(() => {
				Professor.findAll({
					where: {
						fullname: {
							[Op.like]: `%${professor}%`,
						},
					},
				})
					.then((professors) => {
						if (professors.length === 0) {
							return interaction.editReply(
								`No se encontraron resultados para ${professor}.`
							);
						}
						const professorNames = professors.map((prof) => prof.fullname);
						interaction.editReply(
							`Resultados para ${professor}:\n${professorNames.join('\n')}`
						);
					})
					.catch((error) => {
						console.error('Error while searching for professor:', error);
						interaction.editReply('Ocurrió un error al buscar al profesor.');
					});
			});
	},

	/** @type {import('commandkit').CommandOptions} */
	options: {},
};
