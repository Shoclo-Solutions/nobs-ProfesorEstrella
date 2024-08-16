import refreshRatingsJob from './refreshRating';

const startAllJobs = () => {
  try {
    refreshRatingsJob.start();

    console.info('All cron jobs have been started successfully!');
  } catch (error) {
    console.error(
      `There was an error while running all the cron jobs: ${error}`
    );
  }
};

export default startAllJobs;
