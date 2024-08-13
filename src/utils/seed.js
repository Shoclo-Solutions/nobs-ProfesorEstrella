const Professor = require('../models/profesor');
const Comment = require('../models/comentario');
const Course = require('../models/curso');
const sequelizeInstance = require('../utils/database');

Professor.hasMany(Comment, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Professor.hasMany(Course, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Comment.belongsTo(Professor, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Course.belongsTo(Professor, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });

sequelizeInstance
  .sync({ alter: true })
  .then(async () => {
    await Professor.bulkCreate(
      [
        {
          id: 1,
          fullname: 'Juan Perez Tasayco',
          contract: 'Full-time',
        },
        {
          id: 2,
          fullname: 'Pedro Carayos Tasayco',
          contract: 'Part-Time',
        },
        {
          id: 3,
          fullname: 'Pablo Coya Portera',
          contract: 'Part-Time',
        },
        {
          id: 4,
          fullname: 'Maria Coya Portera',
          contract: 'Full-Time',
        },
      ],
      {
        validate: true,
      }
    );

    await Comment.bulkCreate(
      [
        {
          by: '@user1',
          content: 'como se usa esto',
          rating: 3,
          professorId: 1,
        },
        {
          by: '@user2',
          content: 'no es muy bueno explicando, se la pasa con ppts',
          rating: 1,
          professorId: 2,
        },
        {
          by: '@user3',
          content: 'muy buen profesor, explica muy bien',
          rating: 5,
          professorId: 3,
        },
        {
          by: '@user4',
          content: 'no es muy bueno explicando, se la pasa con ppts',
          rating: 1,
          professorId: 4,
        },
        {
          by: '@user5',
          content: 'muy buen profesor, explica muy bien',
          rating: 5,
          professorId: 1,
        },
        {
          by: '@user6',
          content: 'no es muy bueno explicando, se la pasa con ppts',
          rating: 1,
          professorId: 2,
        },
        {
          by: '@user7',
          content: 'muy buen profesor, explica muy bien',
          rating: 5,
          professorId: 3,
        },
        {
          by: '@user8',
          content: 'no es muy bueno explicando, se la pasa con ppts',
          rating: 1,
          professorId: 4,
        },
      ],
      { validate: true }
    );

    await Course.bulkCreate(
      [
        {
          name: 'POO 1, Estructuras Discretas',
          professorId: 1,
        },
        {
          name: 'Armado de vacitos 2, Estructuras de Datos Avanzadas',
          professorId: 1,
        },
        {
          name: 'Calculo 1, POO 2',
          professorId: 3,
        },
        {
          name: 'Calculo 2, Armado de vacitos 1',
          professorId: 2,
        },
      ],
      { validate: true }
    );
  })
  .catch((error) => {
    console.error('Error while syncing database:', error);
  });
