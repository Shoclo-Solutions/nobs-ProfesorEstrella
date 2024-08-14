const { CronJob } = require('cron');
const { QueryTypes } = require('sequelize');
const sequelizeInstance = require('../utils/database.js');

// Asyncronous procedure that runs monthly to calculate and refresh the rating of all the professors
const refreshRating = async () => {
  try {
    // Query to get all the professors
    const professors = await sequelizeInstance.query(
      'SELECT * FROM professors',
      {
        type: QueryTypes.SELECT,
      }
    );

    // Loop through all the professors
    for (const professor of professors) {
      // Query to get all the ratings of the professor
      const ratings = await sequelizeInstance.query(
        `SELECT rating FROM comments WHERE professorId = ${professor.id}`,
        {
          type: QueryTypes.SELECT,
        }
      );

      // Calculate the rating of the professor
      let rating = 0;
      for (const ratingObj of ratings) {
        rating += ratingObj.rating;
      }
      rating /= ratings.length;

      // Update the rating of the professor in the database
      await sequelizeInstance.query(
        `UPDATE professors SET averageRating = ${rating} WHERE id = ${professor.id}`
      );
    }
  } catch (error) {
    console.error(`Error during the refreshRating procedure: ${error}`);
  }
};

// Cron job that runs the refreshRating procedure every 1 minute
const refreshRatingsJob = new CronJob('0 0 1 * *', refreshRating, {
  start: true,
  timeZone: 'America/Lima',
});

module.exports = refreshRatingsJob;
