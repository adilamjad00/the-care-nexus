const cron = require('node-cron');
const Appointment = require('../models/Appointment');

/**
 * Reservation Cleanup Job
 * Runs every minute to delete 'reserved' appointments that haven't been finalized within 5 minutes.
 */
cron.schedule('* * * * *', async () => {
  try {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);

    const result = await Appointment.deleteMany({
      status: 'reserved',
      createdAt: { $lt: fiveMinsAgo },
    });

    if (result.deletedCount > 0) {
      console.log(
        `[Cron] Deleted ${result.deletedCount} expired reserved appointments.`,
      );
    }
  } catch (err) {
    console.error('[Cron Error] Reservation cleanup failed:', err.message);
  }
});

console.log('[Cron] Automation jobs initialized.');
