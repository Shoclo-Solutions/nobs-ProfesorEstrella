const sequelizeInstance = require('./utils/database');
const Professor = require('./models/profesor.js');
const Comment = require('./models/comentario.js');
const Course = require('./models/curso.js');

// ONLY ADDS NEW COLUMNS, DOESNT DROP ANYTHING.
// sequelizeInstance.sync({ alter: true });
// ONLY USE WHEN YOU WANT TO DROP ALL DATA AND MAKES NEW CHANGES. IT NUKES THE DB WITH NEW MODELS.
// sequelizeInstance.sync({ force: true });

Professor.hasMany(Comment, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Professor.hasMany(Course, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Comment.belongsTo(Professor, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Course.belongsTo(Professor, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });

sequelizeInstance
  .sync({ force: true })
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
          name: 'POO 1',
          professorId: 1,
        },
        {
          name: 'Armado de vacitos 2',
          professorId: 1,
        },
        {
          name: 'Calculo 1',
          professorId: 3,
        },
        {
          name: 'Calculo 2',
          professorId: 2,
        },
        {
          name: 'Estructuras de Datos Avanzadas',
          professorId: 4,
        },
        {
          name: 'POO 2',
          professorId: 3,
        },
        {
          name: 'Calculo 3',
          professorId: 4,
        },
        {
          name: 'Administración de juergas',
          professorId: 1,
        },
      ],
      { validate: true }
    );
  })
  .then((data) => {
    console.info('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error while syncing database:', error);
  });
