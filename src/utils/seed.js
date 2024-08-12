const Professor = require('../models/profesor');
const Comment = require('../models/comentario');
const Course = require('../models/curso');
const sequelizeInstance = require('../utils/database');

sequelizeInstance
	.sync({ alter: true })
	.then(() => {
		const Profe = Professor.create({
			fullname: 'Juan Perez Tasayco',
			contract: 'Full-time',
		}).then(() => {
			console.info('Professor saved!');
		});
		const Comentario = Comment.create({
			by: '@user',
			content: 'This is a test comment',
			rating: 3,
			professorId: 1,
		}).then(() => {
			console.info('Comment saved!');
		});
		const Curso = Course.create({
			name: 'Math, Programming and Algorithms',
			professorId: 1,
		}).then(() => {
			console.info('Course saved!');
		});
	})
	.catch((error) => {
		console.error('Error while syncing database:', error);
	});
