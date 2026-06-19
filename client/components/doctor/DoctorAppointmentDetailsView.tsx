'use client';

import { useGetAppointmentByIdQuery } from '@/store/api/doctorApi';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  FileText,
  Activity,
  User,
  BriefcaseMedical,
  CircleDollarSign,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DoctorAppointmentDetailsView({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const t = useTranslations();
  const { data, isLoading, error } = useGetAppointmentByIdQuery(appointmentId);

  if (isLoading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='h-48 bg-surface rounded-2xl' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='h-64 bg-surface rounded-2xl' />
          <div className='h-64 bg-surface rounded-2xl' />
        </div>
      </div>
    );
  }

  const appointment = data?.data;

  if (error || !appointment) {
    return (
      <div className='flex flex-col items-center justify-center py-14 text-center rounded-2xl bg-gray-50 border border-black/6'>
        <div className='h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mb-3'>
          <svg
            className='h-5 w-5 text-red-400'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.9}
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'
            />
          </svg>
        </div>
        <p className='text-sm font-medium text-text-primary'>
          Failed to load appointment
        </p>
        <p className='text-xs text-text-secondary mt-1'>
          Please try again or contact support
        </p>
      </div>
    );
  }

  const prescription =
    appointment.prescription || appointment.prescriptionId || null;
  const prescriptionId =
    (typeof prescription === 'object' && prescription?._id) ||
    (typeof appointment.prescriptionId === 'string'
      ? appointment.prescriptionId
      : null);
  const doctorDefaultFee = Number(appointment.doctor?.consultationFee || 0);
  const consultationFee = Number(
    appointment.prescription?.consultationFee ||
      appointment.prescriptionId?.consultationFee ||
      doctorDefaultFee,
  );
  const medicineCost = Number(
    appointment.prescription?.medicineCost ||
      appointment.prescriptionId?.medicineCost ||
      0,
  );
  const totalFee = Number(
    appointment.totalFee ||
      appointment.prescription?.totalCost ||
      appointment.prescriptionId?.totalCost ||
      consultationFee + medicineCost ||
      doctorDefaultFee,
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-surface-cream text-[#B45309]   border border-border-light ',
      confirmed: 'bg-primary/20 text-primary border border-primary/30',
      accepted: 'bg-primary/20 text-primary border border-primary/30',
      completed: 'bg-surface text-primary   border border-border-light ',
      cancelled: 'bg-red-100 text-red-800   border border-red-200 ',
    };

    return (
      <span
        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${styles[status] || styles.pending}`}
      >
        {t(`common.status.${status}`) || status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-2xl border border-border-light overflow-hidden'>
        <div className='p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6'>
          <div className='flex items-center gap-6'>
            <div className='h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary'>
              <Calendar className='h-8 w-8' />
            </div>
            <div>
              <p className='text-xs font-bold uppercase tracking-widest text-text-secondary mb-1'>
                {t('clinic.dashboard.scheduledFor')}
              </p>
              <div className='flex items-center gap-2'>
                <h2 className='text-xl md:text-2xl font-bold text-text-primary'>
                  {format(new Date(appointment.dateTime), 'MMMM dd, yyyy')}
                </h2>
                <span className='text-gray-300'>•</span>
                <p className='text-base md:text-lg font-medium text-primary'>
                  {format(new Date(appointment.dateTime), 'h:mm a')}
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col md:items-end gap-2'>
            {getStatusBadge(appointment.status)}
            <p className='text-sm font-medium bg-surface text-text-primary px-3 py-1 rounded-full uppercase tracking-wider mt-2 inline-block'>
              {appointment.type || 'CONSULTATION'}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Patient Block */}
        <div className='bg-white p-6 md:p-8 rounded-2xl border border-border-light'>
          <div className='flex flex-col items-center text-center space-y-4'>
            <div className='h-20 w-20 bg-surface rounded-full flex items-center justify-center text-primary ring-4 ring-blue-50 overflow-hidden'>
              {appointment.patientId?.photo ? (
                <img
                  src={appointment.patientId.photo}
                  alt='Patient'
                  className='h-full w-full object-cover'
                />
              ) : (
                <User className='h-10 w-10' />
              )}
            </div>
            <div>
              <h3 className='text-lg md:text-xl font-bold text-text-primary'>
                {appointment.patientId?.name || t('common.noData')}
              </h3>
              <Link
                href={`/dashboard/doctor/patients/${appointment.patientId?._id}`}
                className='mt-1 inline-flex text-sm font-semibold text-primary hover:underline'
              >
                {t('patient.dashboard.viewDetails')}
              </Link>
            </div>
            <div className='w-full pt-4 space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border-light'>
                <span className='text-sm text-text-secondary'>
                  {t('form.email')}
                </span>
                <span className='text-sm font-medium text-text-primary'>
                  {appointment.patientId?.email || t('common.noData')}
                </span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-sm text-text-secondary'>
                  {t('form.phone')}
                </span>
                <span className='text-sm font-medium text-text-primary break-all'>
                  {appointment.patientId?.phone || t('common.noData')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Actions Block */}
        <div className='bg-white p-6 md:p-8 rounded-2xl border border-border-light'>
          <h3 className='text-lg font-bold text-text-primary mb-6 flex items-center gap-2'>
            <Activity className='h-5 w-5 text-text-secondary' />
            Quick Actions
          </h3>
          <div className='space-y-4'>
            {appointment.status !== 'completed' &&
              appointment.status !== 'cancelled' && (
                <Link
                  href={`/dashboard/doctor/prescriptions/new?appointmentId=${appointment._id}`}
                >
                  <button className='w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all'>
                    Start Consultation / New Prescription
                  </button>
                </Link>
              )}
            {prescriptionId && (
              <Link href={`/dashboard/doctor/prescriptions/${prescriptionId}`}>
                <button className='w-full bg-white border border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary/5 transition-all'>
                  View Existing Prescription
                </button>
              </Link>
            )}
            <div className='pt-4 border-t border-border-light'>
              <p className='text-xs text-text-secondary font-medium uppercase tracking-wider mb-2'>
                Patient Records
              </p>
              <Link
                href={`/dashboard/doctor/patients/${appointment.patientId?._id}`}
              >
                <button className='w-full bg-surface text-text-primary py-2 rounded-lg text-sm font-semibold hover:bg-ink-soft transition-all'>
                  Access Medical History
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white p-6 md:p-8 rounded-2xl border border-border-light shadow-sm'>
        <h3 className='text-lg font-bold text-text-primary mb-6 flex items-center gap-2'>
          <FileText className='h-5 w-5 text-text-secondary' />
          Appointment Details
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <div>
              <h4 className='text-sm font-medium text-text-secondary uppercase tracking-wider mb-2'>
                {t('common.patientReason')}
              </h4>
              <div className='bg-white border border-border-light p-4 rounded-lg'>
                <p className='text-text-primary'>
                  "{appointment.reason || t('common.noResults')}"
                </p>
              </div>
            </div>
            {appointment.notes && (
              <div>
                <h4 className='text-sm font-medium text-text-secondary uppercase tracking-wider mb-2'>
                  {t('common.doctorNotes')}
                </h4>
                <div className='bg-surface-cream border border-border-light p-4 rounded-lg'>
                  <p className='text-[#B45309]'>{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>
          <div className='space-y-6'>
            <div className='bg-white border border-border-light p-6 rounded-2xl relative overflow-hidden'>
              <div className='absolute right-0 top-0 opacity-10'>
                <CircleDollarSign className='w-48 h-48 -mr-12 -mt-12 text-primary' />
              </div>
              <h4 className='text-sm font-bold text-primary uppercase tracking-wider mb-6 relative z-10'>
                Revenue Breakdown
              </h4>
              <div className='space-y-4 relative z-10'>
                <div className='flex items-center justify-between pb-4 border-b border-border-light'>
                  <span className='text-primary font-medium'>
                    {t('doctor.prescriptions.consultationFee')}
                  </span>
                  <span className='text-lg font-bold text-text-primary'>
                    {consultationFee.toLocaleString()} {t('common.pkr')}
                  </span>
                </div>
                <div className='flex items-center justify-between pb-4 border-b border-border-light'>
                  <span className='text-primary font-medium'>
                    {t('doctor.prescriptions.medicineCost')}
                  </span>
                  <span className='text-lg font-bold text-text-primary'>
                    {medicineCost.toLocaleString()} {t('common.pkr')}
                  </span>
                </div>
                <div className='flex items-center justify-between pt-2'>
                  <span className='text-primary font-medium'>
                    {t('common.totalFeesProcessed')}
                  </span>
                  <span className='text-2xl font-black text-primary bg-white px-3 py-1 rounded-lg border border-border-light'>
                    {totalFee.toLocaleString()} {t('common.pkr')}
                  </span>
                </div>
                <div className='flex items-center justify-between pt-2'>
                  <span className='text-sm text-text-secondary italic'>
                    Fee processed via clinic
                  </span>
                  <CheckCircle2 className='h-4 w-4 text-green-500' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
