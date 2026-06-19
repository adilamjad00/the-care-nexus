'use client';

import { useGetAppointmentByIdQuery } from '@/store/api/clinicApi';
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

export default function AppointmentDetailsView({
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
      <div className='text-center py-12 bg-white rounded-2xl border border-border-light'>
        <p className='text-text-secondary'>
          Failed to load appointment details.
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
                <span className='text-white/70'>•</span>
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
            <div className='h-20 w-20 bg-surface rounded-full flex items-center justify-center text-primary ring-4 ring-blue-50'>
              {appointment.patientId?.photo ? (
                <img
                  src={appointment.patientId.photo}
                  alt='Patient'
                  className='h-full w-full rounded-full object-cover'
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
                href={`/dashboard/clinic_admin/patients/${appointment.patientId?._id}`}
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

        {/* Doctor Block */}
        <div className='bg-white p-6 md:p-8 rounded-2xl border border-border-light'>
          <div className='flex flex-col items-center text-center space-y-4'>
            <div className='h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary ring-4 ring-primary/5'>
              {appointment.doctorId?.photo ? (
                <img
                  src={appointment.doctorId.photo}
                  alt='Doctor'
                  className='h-full w-full rounded-full object-cover'
                />
              ) : (
                <BriefcaseMedical className='h-10 w-10' />
              )}
            </div>
            <div>
              <Link
                href={`/dashboard/clinic_admin/doctors/${appointment.doctorId?.doctorProfile?._id || appointment.doctorId?._id}?fromAppointment=${appointment._id}`}
                className='hover:underline'
              >
                <h3 className='text-lg md:text-xl font-bold text-text-primary'>
                  {t('common.doctorPrefix')}{' '}
                  {appointment.doctor?.fullName ||
                    appointment.doctorId?.name ||
                    t('common.noData')}
                </h3>
              </Link>
              <p className='text-sm text-primary font-medium mt-1'>
                {appointment.doctorId?.doctorProfile?.specialization ||
                  t('common.noData')}
              </p>
            </div>
            <div className='w-full pt-4 space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-border-light'>
                <span className='text-sm text-text-secondary'>
                  {t('form.email')}
                </span>
                <span className='text-sm font-medium text-text-primary'>
                  {appointment.doctorId?.email || t('common.noData')}
                </span>
              </div>
              <Link
                href={`/dashboard/clinic_admin/doctors/${appointment.doctorId?.doctorProfile?._id || appointment.doctorId?._id}?fromAppointment=${appointment._id}`}
                className='flex justify-between items-center py-2 hover:bg-background/80 rounded-lg px-2 -mx-2 transition-colors group'
              >
                <span className='text-sm text-text-secondary'>
                  {t('clinic.dashboard.viewProfile')}
                </span>
                <span className='text-sm font-bold text-primary group-hover:underline'>
                  {t('common.view')} →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white p-6 md:p-8 rounded-2xl border border-border-light shadow-sm'>
        <h3 className='text-lg font-bold text-text-primary mb-6 flex items-center gap-2'>
          <FileText className='h-5 w-5 text-text-secondary' />
          {t('clinic.dashboard.clinicalFinancialDetails')}
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
            {appointment.cancellationReason && (
              <div>
                <h4 className='text-sm font-medium text-red-500 uppercase tracking-wider mb-2'>
                  {t('common.cancellationReason')}
                </h4>
                <div className='bg-white border border-red-100 p-4 rounded-lg'>
                  <p className='text-red-800'>
                    {appointment.cancellationReason}
                  </p>
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
                    {t('common.totalFeesProcessed')}
                  </span>
                  <span className='text-lg font-bold text-text-primary'>
                    {(appointment.totalFee || 0).toLocaleString()}{' '}
                    {t('common.pkr')}
                  </span>
                </div>
                <div className='flex items-center justify-between pt-2'>
                  <span className='text-primary font-medium flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4' />
                    {t('common.clinicShare')} (20%)
                  </span>
                  <span className='text-2xl font-black text-primary bg-white px-3 py-1 rounded-lg border border-border-light'>
                    {(appointment.clinicRevenue || 0).toLocaleString()}{' '}
                    {t('common.pkr')}
                  </span>
                </div>
              </div>
            </div>

            {prescription && (
              <div className='bg-white border border-border-light p-6 rounded-2xl'>
                <h4 className='text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2'>
                  <Activity className='h-5 w-5' />
                  {t('doctor.prescriptions.title')}
                </h4>
                <p className='text-primary mb-4 text-sm'>
                  A prescription has been created for this appointment
                  containing medications or tests.
                </p>
                <div className='flex gap-3'>
                  <Link
                    href={
                      prescriptionId
                        ? `/dashboard/clinic_admin/prescriptions/${prescriptionId}`
                        : '#'
                    }
                    className='flex-1'
                  >
                    <button className='w-full bg-primary hover:bg-primary text-white py-2 rounded-lg font-medium transition-colors'>
                      {t('prescription.medicalPrescription')}
                    </button>
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className='px-4 bg-white border border-border-light text-primary py-2 rounded-lg font-medium hover:bg-surface :bg-primary/20 transition-colors'
                  >
                    {t('common.download')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
