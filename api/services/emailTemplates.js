const { wrapEmail } = require('../utils/emailLayout');

const dashboardUrl = (path) => `${process.env.FRONTEND_URL}${path}`;

exports.appointmentConfirmed = (data) =>
  wrapEmail(`
    <div class="badge">Appointment Confirmed</div>
    <h1 class="title">You're booked in</h1>
    <p class="text">Hi ${data.patientName}, your appointment with <strong>Dr. ${data.doctorName}</strong> is locked in. Here are the details:</p>
    <div class="detail-box">
        <div class="detail-row"><span class="detail-label">Date / Time</span><span class="detail-value">${data.dateTime}</span></div>
        <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${data.location}</span></div>
        <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${data.type}</span></div>
    </div>
    <p class="text">Please arrive 15 minutes early for check-in.</p>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/patient/appointments')}" class="button">View appointment</a>
    </div>
`);

exports.doctorAppointmentNotice = (data) =>
  wrapEmail(`
    <div class="badge">New Appointment</div>
    <h1 class="title">New appointment request</h1>
    <p class="text">Hello Dr. ${data.doctorName}, a new appointment has been scheduled with <strong>${data.patientName}</strong>.</p>
    <div class="detail-box">
        <div class="detail-row"><span class="detail-label">Date / Time</span><span class="detail-value">${data.dateTime}</span></div>
        <div class="detail-row"><span class="detail-label">Reason</span><span class="detail-value">${data.reason || '—'}</span></div>
    </div>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/doctor/appointments')}" class="button">Manage appointments</a>
    </div>
`);

exports.appointmentAccepted = (data) =>
  wrapEmail(`
    <div class="badge">Appointment Accepted</div>
    <h1 class="title">Your appointment is confirmed</h1>
    <p class="text">Great news, ${data.patientName}. Your appointment with <strong>Dr. ${data.doctorName}</strong> has been accepted.</p>
    <div class="detail-box">
        <div class="detail-row"><span class="detail-label">Date / Time</span><span class="detail-value">${data.dateTime}</span></div>
    </div>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/patient/appointments')}" class="button">View dashboard</a>
    </div>
`);

exports.appointmentRejected = (data) =>
  wrapEmail(`
    <div class="badge badge-danger">Appointment Cancelled</div>
    <h1 class="title">Your appointment was cancelled</h1>
    <p class="text">Hi ${data.patientName}, unfortunately your appointment with <strong>Dr. ${data.doctorName}</strong> on <strong>${data.dateTime}</strong> has been cancelled.</p>
    ${data.reason ? `<div class="note"><strong>Reason:</strong> ${data.reason}</div>` : ''}
    <p class="text">You can book another slot or contact the clinic for assistance.</p>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/patient/book-appointment')}" class="button">Book another slot</a>
    </div>
`);

exports.appointmentCancelledByPatient = (data) =>
  wrapEmail(`
    <div class="badge badge-warn">Appointment Cancelled</div>
    <h1 class="title">Appointment cancelled by patient</h1>
    <p class="text">Hello Dr. ${data.doctorName}, the appointment with <strong>${data.patientName}</strong> on <strong>${data.dateTime}</strong> has been cancelled by the patient.</p>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/doctor/appointments')}" class="button">Check your schedule</a>
    </div>
`);

exports.visitSummary = (data) =>
  wrapEmail(`
    <div class="badge">Visit Complete</div>
    <h1 class="title">Your visit summary is ready</h1>
    <p class="text">Hi ${data.patientName}, your visit with <strong>Dr. ${data.doctorName}</strong> is complete. Your prescription and summary are now available in your portal.</p>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/patient/records')}" class="button">View medical records</a>
    </div>
`);

exports.newPatientWelcome = (data) =>
  wrapEmail(`
    <div class="badge">Welcome to The Care Nexus</div>
    <h1 class="title">Your patient account is ready</h1>
    <p class="text">Hi ${data.patientName}, you've been added to the patient registry of <strong>Dr. ${data.doctorName}</strong> on Care Nexus.</p>
    <p class="text">You can now manage appointments, view prescriptions, and track your health records online.</p>
    <div class="button-container">
        <a href="${dashboardUrl('/login')}" class="button">Access your portal</a>
    </div>
`);

exports.newPrescription = (data) =>
  wrapEmail(`
    <div class="badge">New Prescription</div>
    <h1 class="title">A new prescription is available</h1>
    <p class="text">Hi ${data.patientName}, <strong>Dr. ${data.doctorName}</strong> has issued a new prescription for you. You can review it anytime from your patient portal.</p>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/patient/records')}" class="button">View prescription</a>
    </div>
`);

exports.followUpReminder = (data) =>
  wrapEmail(`
    <div class="badge">Follow-up Reminder</div>
    <h1 class="title">Time for your follow-up</h1>
    <p class="text">Hi ${data.patientName}, this is a friendly reminder for your upcoming follow-up with <strong>Dr. ${data.doctorName}</strong>.</p>
    <div class="detail-box">
        <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${data.date}</span></div>
    </div>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/patient/book-appointment')}" class="button">Book appointment</a>
    </div>
`);

exports.appointmentReminder = (data) =>
  wrapEmail(`
    <div class="badge">Reminder</div>
    <h1 class="title">Your appointment is tomorrow</h1>
    <p class="text">Hi ${data.patientName}, this is a reminder for your appointment tomorrow with <strong>Dr. ${data.doctorName}</strong>.</p>
    <div class="detail-box">
        <div class="detail-row"><span class="detail-label">Date / Time</span><span class="detail-value">${data.dateTime}</span></div>
    </div>
    <p class="text">We look forward to seeing you.</p>
`);

exports.newStaffAccount = (data) =>
  wrapEmail(`
    <div class="badge">Staff Account Created</div>
    <h1 class="title">Welcome to the team</h1>
    <p class="text">Hi ${data.name}, a staff account has been created for you at <strong>${data.clinicName}</strong> on Care Nexus.</p>
    <p class="text">Use the temporary password below to sign in, then change it immediately from your profile settings.</p>
    <div class="code-box">${data.password}</div>
    <div class="button-container">
        <a href="${dashboardUrl('/login')}" class="button">Log in now</a>
    </div>
    <p class="text-muted">For your security, please update this password after your first sign-in.</p>
`);

exports.doctorAddedToClinic = (data) =>
  wrapEmail(`
    <div class="badge">Clinic Membership</div>
    <h1 class="title">You've been added to a clinic</h1>
    <p class="text">Hi Dr. ${data.doctorName}, you've been successfully added to <strong>${data.clinicName}</strong> on Care Nexus.</p>
    <p class="text">You can now manage appointments and patients for this clinic directly from your doctor portal.</p>
    <div class="button-container">
        <a href="${dashboardUrl('/dashboard/doctor')}" class="button">Go to portal</a>
    </div>
`);
