import toast from 'react-hot-toast';

export const showToast = {
  patientAdded: (t: any) => toast.success(t('toast.patientAdded')),
  patientRemoved: (t: any) => toast.success(t('toast.patientRemoved')),
  scheduleSaved: (t: any) => toast.success(t('toast.scheduleSaved')),
  prescriptionSaved: (t: any) => toast.success(t('toast.prescriptionSaved')),
  appointmentBooked: (t: any) => toast.success(t('toast.appointmentBooked')),
  appointmentCancelled: (t: any) => toast.success(t('toast.appointmentCancelled')),
  slotUnavailable: (t: any) => toast.error(t('toast.slotUnavailable')),
  familyAdded: (t: any) => toast.success(t('toast.familyAdded')),
  familyRemoved: (t: any) => toast.success(t('toast.familyRemoved')),
  profileUpdated: (t: any) => toast.success(t('toast.profileUpdated')),
  passwordChanged: (t: any) => toast.success(t('toast.passwordChanged')),
  settingsSaved: (t: any) => toast.success(t('toast.settingsSaved')),
  doctorAdded: (t: any) => toast.success(t('toast.doctorAdded')),
  doctorRemoved: (t: any) => toast.success(t('toast.doctorRemoved')),
  staffCreated: (t: any) => toast.success(t('toast.staffCreated')),
  staffRemoved: (t: any) => toast.success(t('toast.staffRemoved')),
  error: (t: any, msg?: string) => toast.error(msg || t('common.error')),
};
