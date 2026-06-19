const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendNotification } = require('../services/notificationService');

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

const ACCEPTED_STATUSES = ['accepted', 'confirmed'];

const runAppointmentReminderJob = async () => {
  try {
    const now = new Date();

    const patientWindows = [
      {
        label: '24h',
        start: new Date(now.getTime() + 23 * HOUR),
        end: new Date(now.getTime() + 25 * HOUR),
        titleKey: 'appointmentTomorrow',
        bodyKey: 'appointmentTomorrowBody',
      },
      {
        label: '2h',
        start: new Date(now.getTime() + 105 * MIN),
        end: new Date(now.getTime() + 135 * MIN),
        titleKey: 'appointmentSoon',
        bodyKey: 'appointmentSoonBody',
      },
    ];

    const doctorWindows = [
      {
        label: '24h',
        start: new Date(now.getTime() + 23 * HOUR),
        end: new Date(now.getTime() + 25 * HOUR),
        titleKey: 'doctorApptTomorrow',
        bodyKey: 'doctorApptTomorrowBody',
      },
      {
        label: '30min',
        start: new Date(now.getTime() + 25 * MIN),
        end: new Date(now.getTime() + 35 * MIN),
        titleKey: 'doctorApptSoon',
        bodyKey: 'doctorApptSoonBody',
      },
    ];

    for (const window of patientWindows) {
      const appointments = await Appointment.find({
        dateTime: { $gte: window.start, $lte: window.end },
        status: { $in: ACCEPTED_STATUSES },
      })
        .populate('patientId', '_id')
        .populate('doctorId', 'name')
        .populate('clinicId', 'name');

      await Promise.allSettled(
        appointments.map((appt) => {
          if (!appt?.patientId?._id || !appt?.dateTime)
            return Promise.resolve(null);

          const dedupeKey = `carenexus:notif:patient_appt:${appt._id}:${window.label}`;
          const dateISO = new Date(appt.dateTime).toISOString();

          return sendNotification(appt.patientId._id, {
            type: 'appointment_reminder',
            titleKey: window.titleKey,
            bodyKey: window.bodyKey,
            bodyParams:
              window.label === '24h'
                ? {
                    doctorName: appt?.doctorId?.name || 'Doctor',
                    time: dateISO,
                    clinicName: appt?.clinicId?.name || 'Clinic',
                  }
                : {
                    doctorName: appt?.doctorId?.name || 'Doctor',
                    time: dateISO,
                  },
            actionUrl: '/dashboard/patient/appointments',
            dedupeKey,
          });
        }),
      );
    }

    for (const window of doctorWindows) {
      const appointments = await Appointment.find({
        dateTime: { $gte: window.start, $lte: window.end },
        status: { $in: ACCEPTED_STATUSES },
      })
        .populate('patientId', 'name')
        .populate('doctorId', '_id')
        .populate('clinicId', 'name');

      await Promise.allSettled(
        appointments.map(async (appt) => {
          if (!appt?.doctorId?._id || !appt?.dateTime) return null;

          const dedupeKey = `carenexus:notif:doctor_appt:${appt._id}:${window.label}`;
          const dateISO = new Date(appt.dateTime).toISOString();

          if (window.label === '24h') {
            const dayStart = new Date(appt.dateTime);
            dayStart.setUTCHours(0, 0, 0, 0);
            const dayEnd = new Date(appt.dateTime);
            dayEnd.setUTCHours(23, 59, 59, 999);

            const count = await Appointment.countDocuments({
              doctorId: appt.doctorId._id,
              status: { $in: ACCEPTED_STATUSES },
              dateTime: { $gte: dayStart, $lte: dayEnd },
            });

            return sendNotification(appt.doctorId._id, {
              type: 'doctor_appointment_reminder',
              titleKey: window.titleKey,
              bodyKey: window.bodyKey,
              bodyParams: {
                patientName: appt?.patientId?.name || 'Patient',
                time: dateISO,
                clinicName: appt?.clinicId?.name || 'Clinic',
                count,
              },
              actionUrl: '/dashboard/doctor/appointments',
              dedupeKey,
            });
          }

          return sendNotification(appt.doctorId._id, {
            type: 'doctor_appointment_reminder',
            titleKey: window.titleKey,
            bodyKey: window.bodyKey,
            bodyParams: {
              patientName: appt?.patientId?.name || 'Patient',
              time: dateISO,
            },
            actionUrl: '/dashboard/doctor/appointments',
            dedupeKey,
          });
        }),
      );
    }
  } catch (error) {
    console.error('Appointment reminder job failed:', error.message);
  }
};

cron.schedule('0 * * * *', runAppointmentReminderJob);

module.exports = { runAppointmentReminderJob };
