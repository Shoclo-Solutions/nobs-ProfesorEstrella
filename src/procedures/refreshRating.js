import { CronJob } from 'cron';
const { QueryTypes } = require('sequelize');
const sequelizeInstance = require('../utils/database.js');

// Cron job that runs the refreshRating procedure every 1 minute
// Asyncronous procedure that runs weekly to calculate and refresh the rating of all the professors
const refreshRatingsJob = new CronJob(
  '0 6 * * 1',
  async function () {
    try {
      console.info('Running the refreshRating procedure...');
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
      console.info('The refreshRating procedure has finished successfully!');
    } catch (error) {
      console.error(`Error during the refreshRating procedure: ${error}`);
    }
  },
  null,
  true,
  'America/Lima'
);

export default refreshRatingsJob;
