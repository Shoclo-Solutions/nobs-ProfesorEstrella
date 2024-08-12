const sequelizeInstance = require('./utils/database');
const Professor = require('./models/profesor');
const Comment = require('./models/comentario');
const Course = require('./models/curso');

Professor.hasMany(Comment, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Professor.hasMany(Course, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Comment.belongsTo(Professor, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Course.belongsTo(Professor, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });

// ONLY ADDS NEW COLUMNS, DOESNT DROP ANYTHING.
// sequelizeInstance.sync({ alter: true });
// ONLY USE WHEN YOU WANT TO DROP ALL DATA AND MAKES NEW CHANGES. IT NUKES THE DB WITH NEW MODELS.
// sequelizeInstance.sync({ force: true });

sequelizeInstance
  .sync({ force: true })
  .then((data) => {
    console.info('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error while syncing database:', error);
  });
