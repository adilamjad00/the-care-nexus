const cron = require('node-cron');
const Prescription = require('../models/Prescription');
const { sendNotification } = require('../services/notificationService');

const HOUR = 60 * 60 * 1000;

const buildWindows = () => {
  const now = new Date();
  return [
    {
      label: '3day',
      start: new Date(now.getTime() + 71 * HOUR),
      end: new Date(now.getTime() + 73 * HOUR),
      titleKey: 'followUpIn3Days',
      bodyKey: 'followUpIn3DaysBody',
    },
    {
      label: '1day',
      start: new Date(now.getTime() + 23 * HOUR),
      end: new Date(now.getTime() + 25 * HOUR),
      titleKey: 'followUpTomorrow',
      bodyKey: 'followUpTomorrowBody',
    },
    {
      label: 'sameday',
      start: now,
      end: new Date(now.getTime() + 6 * HOUR),
      titleKey: 'followUpToday',
      bodyKey: 'followUpTodayBody',
    },
  ];
};

const runFollowUpReminderJob = async () => {
  try {
    const windows = buildWindows();

    for (const window of windows) {
      const prescriptions = await Prescription.find({
        followUpDate: { $gte: window.start, $lte: window.end, $ne: null },
      })
        .populate('patientId', '_id')
        .populate('doctorId', 'name');

      await Promise.allSettled(
        prescriptions.map((rx) => {
          if (!rx?.patientId?._id || !rx?.followUpDate)
            return Promise.resolve(null);

          const followUpISO = new Date(rx.followUpDate).toISOString();
          const doctorName = rx?.doctorId?.name || 'Doctor';
          const dedupeKey = `carenexus:notif:followup:${rx._id}:${window.label}`;

          return sendNotification(rx.patientId._id, {
            type: 'follow_up_reminder',
            titleKey: window.titleKey,
            bodyKey: window.bodyKey,
            bodyParams:
              window.label === 'sameday'
                ? { doctorName, time: followUpISO }
                : { doctorName, date: followUpISO },
            actionUrl: `/dashboard/patient/records/${rx._id}`,
            dedupeKey,
          });
        }),
      );
    }
  } catch (error) {
    console.error('Follow-up reminder job failed:', error.message);
  }
};

cron.schedule('0 */6 * * *', runFollowUpReminderJob);

module.exports = { runFollowUpReminderJob };
