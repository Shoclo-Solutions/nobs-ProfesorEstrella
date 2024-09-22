require('dotenv/config');
const sequelizeInstance = require('./database.js');
const Professor = require('../models/profesor.js');
const Comment = require('../models/comentario.js');

Professor.hasMany(Comment, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Comment.belongsTo(Professor, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });

async function syncAndSeedDB() {
  if (process.env.NODE_ENV === 'development') {
    sequelizeInstance
      .sync({ force: true })
      .then(async () => {
        console.info('Database synced successfully');
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
            {
              id: 5,
              fullname: 'Constantino Augusto Coralies',
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
              by: '418622182671777812',
              content: 'mi vida no es mas que un paseo en el parque',
              rating: 3,
              professorId: 1,
            },
            {
              by: '451379187031343104',
              content: 'auxilio me desmayo',
              rating: 1,
              courses: 'formacion de empresas de base tecnológica',
              professorId: 2,
            },
            {
              by: '282859044593598464',
              content: 'muy buen profesor, explica muy bien',
              rating: 5,
              courses: 'introduccion al dibujo técnico',
              professorId: 3,
            },
            {
              by: '536991182035746816',
              content: 'no es muy bueno explicando, se la pasa con ppts',
              rating: 1,
              professorId: 4,
            },
            {
              by: '1271110418882101312',
              content: 'casi me muero de aburrimiento',
              rating: 5,
              courses: 'calculo 1, poo 1',
              professorId: 1,
            },
            {
              by: '429457053791158281',
              content: 'profe de mierda no sabe nada',
              rating: 1,
              courses: 'calculo 1, poo 2',
              professorId: 5,
            },
            {
              by: '414925323197612032',
              content: 'excelente profesor, muy recomendado',
              rating: 5,
              professorId: 3,
            },
            {
              by: '412347257233604609',
              content: 'tenia que ser de la cato :u',
              rating: 1,
              professorId: 4,
            },
            {
              by: '675996677366218774',
              content: '0000000000000000000000000000',
              rating: 1,
              professorId: 1,
            },
            {
              by: '155149108183695360',
              content: 'todo mal, no aprendi nada',
              rating: 5,
              professorId: 1,
            },
            {
              by: '819778342818414632',
              content:
                'acepto un trabajito a cambio de mi 20, recomendado 100%',
              rating: 1,
              professorId: 1,
            },
            {
              by: '339926969548275722',
              content: 'mejor profesor de la vida',
              rating: 5,
              professorId: 1,
            },
            {
              by: '270904126974590976',
              content: 'no se que decir',
              rating: 1,
              professorId: 1,
            },
          ],
          { validate: true }
        );
      })
      .then(() => {
        console.info('Database sync completed successfully');
      })
      .catch((error) => {
        console.error('Error while syncing database:', error);
      });
  } else if (process.env.NODE_ENV === 'production') {
    // TODO: Run backup before syncing
    sequelizeInstance
      .sync()
      .then(() => {
        console.info('Database sync completed successfully');
      })
      .catch((error) => {
        console.error('Error while syncing database:', error);
      });
  }
}

module.exports = { sequelizeInstance, syncAndSeedDB };
