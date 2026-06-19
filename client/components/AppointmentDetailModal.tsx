'use client';

import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Activity,
  Pill,
  FileText,
  Droplet,
  Clock,
} from 'lucide-react';
import {
  MapPinIcon,
  UserIcon,
  FileDescriptionIcon,
  DownloadIcon,
  ClockIcon,
  GmailIcon,
  PhoneVolumeIcon,
} from '@/icons';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useFormatter, useTranslations } from 'next-intl';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  loading?: boolean;
}

export default function AppointmentDetailModal({
  isOpen,
  onClose,
  appointment,
  loading = false,
}: AppointmentDetailModalProps) {
  const t = useTranslations();
  const formatIntl = useFormatter();
  if (!appointment && !loading) return null;

  const handleDownloadPDF = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'teal';
      case 'confirmed':
        return 'blue';
      case 'pending':
        return 'yellow';
      case 'reserved':
        return 'yellow';
      case 'cancelled':
        return 'red';
      case 'in-progress':
        return 'purple';
      default:
        return 'slate';
    }
  };

  const getStatusLabel = (status: string) => {
    const normalized = (status || '').toLowerCase();
    const labels: Record<string, string> = {
      pending: t('appointment.status.pending'),
      confirmed: t('appointment.status.confirmed'),
      reserved: t('appointment.status.reserved'),
      accepted: t('appointment.status.accepted'),
      completed: t('appointment.status.completed'),
      cancelled: t('appointment.status.cancelled'),
      'in-progress': t('appointment.status.in-progress'),
    };

    return labels[normalized] || normalized.replace(/-/g, ' ');
  };

  const clinicName =
    appointment?.clinicId?.name ||
    appointment?.clinic?.name ||
    t('appointment.clinic');
  const clinicAddress =
    appointment?.clinicId?.address ||
    appointment?.clinic?.address ||
    t('common.noData');

  const resolveImageUrl = (photo?: string | null) => {
    if (!photo) return '';
    const trimmed = String(photo).trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:'))
      return trimmed;
    const base =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(
        /\/api\/?$/,
        '',
      );
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${base}${path}`;
  };

  const patientPhotoUrl = resolveImageUrl(appointment?.patient?.photo);
  const doctorPhotoUrl = resolveImageUrl(appointment?.doctor?.photo);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('doctor.appointments.viewDetails')}
      size='lg'
    >
      {loading ? (
        <div className='flex flex-col items-center justify-center py-12 space-y-4'>
          <div className='h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin' />
          <p className='text-text-secondary font-medium'>
            {t('common.loading')}
          </p>
        </div>
      ) : (
        <div className='space-y-8 pb-4'>
          {/* Header Info */}
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-background rounded-2xl border border-border-light'>
            <div className='flex items-center gap-4'>
              <div className='h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center'>
                <Calendar className='h-7 w-7 text-primary' />
              </div>
              <div>
                <p className='text-xs font-bold text-text-secondary uppercase tracking-widest'>
                  {t('common.date')}
                </p>
                <p className='text-lg font-black text-text-primary'>
                  {appointment.dateTime
                    ? formatIntl.dateTime(new Date(appointment.dateTime), {
                        dateStyle: 'full',
                      })
                    : t('common.noData')}
                </p>
                <div className='flex items-center gap-2 mt-1 text-sm font-medium text-text-secondary'>
                  <ClockIcon className='h-4 w-4' />
                  {appointment.dateTime
                    ? formatIntl.dateTime(new Date(appointment.dateTime), {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : t('common.noData')}{' '}
                  ({appointment.duration || 0} {t('common.mins')})
                </div>
              </div>
            </div>
            <div className='flex flex-col items-end'>
              <Badge
                variant={getStatusColor(appointment.status)}
                className='mb-2'
              >
                {getStatusLabel(appointment.status)}
              </Badge>
              <div className='text-xs font-bold text-text-secondary uppercase tracking-widest'>
                {t('common.type')}:{' '}
                <span className='text-text-primary ml-1'>
                  {appointment.type}
                </span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Patient Section */}
            <div className='space-y-4 p-6 rounded-2xl bg-white border border-border-light'>
              <div className='flex items-center gap-2 mb-4'>
                <UserIcon className='h-5 w-5 text-primary' />
                <h3 className='text-lg font-black text-text-primary'>
                  {t('clinic.appointments.patient')}
                </h3>
              </div>

              <div className='flex items-center gap-4'>
                {/* Patient Avatar — 64px, with initials fallback */}
                <div className='h-16 w-16 rounded-2xl overflow-hidden border-2 border-border-light bg-primary/10 flex items-center justify-center shrink-0'>
                  {patientPhotoUrl ? (
                    <img
                      src={patientPhotoUrl}
                      alt={
                        appointment.patient?.name ||
                        t('clinic.appointments.patient')
                      }
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          'none';
                        (
                          e.currentTarget.parentElement as HTMLElement
                        ).innerHTML =
                          `<span class="text-xl font-black text-primary">${(appointment.patient?.name || '?').charAt(0).toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span className='text-xl font-black text-primary'>
                      {(appointment.patient?.name || '?')
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='font-black text-text-primary text-base truncate'>
                    {appointment.patient?.name || t('common.noData')}
                  </p>
                  <p className='text-sm text-text-secondary truncate'>
                    {appointment.patient?.email || t('common.noData')}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3 pt-2'>
                <div className='p-3 bg-background rounded-2xl'>
                  <p className='text-[10px] font-black text-text-secondary uppercase tracking-tighter'>
                    {t('patient.profile.bloodGroup')}
                  </p>
                  <div className='flex items-center gap-1.5 mt-0.5'>
                    <Droplet className='h-3 w-3 text-red-500' />
                    <span className='font-bold text-text-primary'>
                      {appointment.patient?.bloodGroup || '—'}
                    </span>
                  </div>
                </div>
                <div className='p-3 bg-background rounded-2xl'>
                  <p className='text-[10px] font-black text-text-secondary uppercase tracking-tighter'>
                    {t('form.phone')}
                  </p>
                  <div className='flex items-center gap-1.5 mt-0.5'>
                    <PhoneVolumeIcon className='h-3 w-3 text-text-secondary' />
                    <span className='font-bold text-text-primary break-all text-sm'>
                      {appointment.patient?.contact || t('common.noData')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Section */}
            <div className='space-y-4 p-6 rounded-2xl bg-white border border-border-light'>
              <div className='flex items-center gap-2 mb-4'>
                <Activity className='h-5 w-5 text-primary' />
                <h3 className='text-lg font-black text-text-primary'>
                  {t('clinic.appointments.doctor')}
                </h3>
              </div>

              <div className='flex items-center gap-4'>
                {/* Doctor Avatar — 64px, with initials fallback */}
                <div className='h-16 w-16 rounded-2xl overflow-hidden border-2 border-border-light bg-primary/10 flex items-center justify-center shrink-0'>
                  {doctorPhotoUrl ? (
                    <img
                      src={doctorPhotoUrl}
                      alt={
                        appointment.doctor?.name ||
                        t('clinic.appointments.doctor')
                      }
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          'none';
                        (
                          e.currentTarget.parentElement as HTMLElement
                        ).innerHTML =
                          `<span class="text-xl font-black text-primary">${(appointment.doctor?.name || 'D').charAt(0).toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span className='text-xl font-black text-primary'>
                      {(appointment.doctor?.name || 'D')
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='font-black text-text-primary text-base'>
                    {t('patient.bookAppointmentPage.doctorPrefix')}{' '}
                    {appointment.doctor?.name || t('common.noData')}
                  </p>
                  <p className='text-sm text-primary font-bold'>
                    {appointment.doctor?.specialization || '—'}
                  </p>
                </div>
              </div>

              <div className='space-y-2 pt-2'>
                <div className='flex items-center gap-2 text-sm font-medium text-text-secondary'>
                  <MapPinIcon className='h-4 w-4 shrink-0 text-text-secondary' />
                  <span className='line-clamp-1'>{clinicName}</span>
                </div>
                <div className='flex items-center gap-2 text-sm font-medium text-text-secondary'>
                  <MapPinIcon className='h-4 w-4 shrink-0 text-text-secondary' />
                  <span className='line-clamp-1'>{clinicAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prescription Section — white card, visible */}
          <div className='p-6 rounded-2xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between mb-5'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-primary/10 rounded-lg'>
                  <Pill className='h-5 w-5 text-primary' />
                </div>
                <h3 className='text-lg font-bold text-gray-900'>
                  {t('doctor.prescriptions.title')}
                </h3>
              </div>
              {(appointment.prescription || appointment.prescriptionId) && (
                <button
                  onClick={handleDownloadPDF}
                  className='flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors'
                >
                  <DownloadIcon className='h-3.5 w-3.5' />
                  {t('common.view')}
                </button>
              )}
            </div>

            {(() => {
              const rx = appointment.prescription || appointment.prescriptionId;
              if (!rx) {
                return (
                  <div className='py-8 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200'>
                    <FileDescriptionIcon className='h-10 w-10 text-gray-300 mb-3' />
                    <p className='font-semibold text-gray-400'>
                      {t('doctor.prescriptions.noPrescriptions')}
                    </p>
                  </div>
                );
              }
              return (
                <div className='space-y-4'>
                  {/* Diagnosis */}
                  <div className='p-4 bg-primary/5 rounded-2xl border border-primary/10'>
                    <p className='text-[10px] font-black text-primary uppercase tracking-widest mb-1.5'>
                      {t('doctor.diagnosis')}
                    </p>
                    <p className='font-bold text-gray-900 text-base'>
                      {rx.diagnosis || '—'}
                    </p>
                  </div>

                  {/* Medicines */}
                  {rx.medicines?.length > 0 && (
                    <div>
                      <p className='text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2'>
                        {t('doctor.prescriptions.table.medicines')}
                      </p>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        {rx.medicines.map((med: any, idx: number) => (
                          <div
                            key={idx}
                            className='p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3'
                          >
                            <div className='h-2.5 w-2.5 rounded-full bg-primary shrink-0' />
                            <div>
                              <p className='font-bold text-gray-900 text-sm'>
                                {med.name}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {med.dosage} — {med.duration}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up + Notes row */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <div className='p-4 bg-gray-50 rounded-2xl border border-gray-100'>
                      <p className='text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1'>
                        {t('doctor.notes')}
                      </p>
                      <p className='text-sm text-gray-700 leading-relaxed'>
                        {rx.notes || '—'}
                      </p>
                    </div>
                    <div className='p-4 bg-gray-50 rounded-2xl border border-gray-100'>
                      <p className='text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5'>
                        {t('doctor.followUp')}
                      </p>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 text-primary' />
                        <p className='font-bold text-gray-900 text-sm'>
                          {rx.followUpDate
                            ? formatIntl.dateTime(new Date(rx.followUpDate), {
                                dateStyle: 'medium',
                              })
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fees */}
                  <div className='flex justify-end'>
                    <div className='px-5 py-3 bg-primary rounded-2xl text-white text-right'>
                      <p className='text-[10px] font-bold text-white/70 uppercase tracking-widest'>
                        {t('doctor.profile.consultationFee')}
                      </p>
                      <p className='text-xl font-black mt-0.5'>
                        {(
                          rx.totalCost ||
                          rx.consultationFee ||
                          0
                        ).toLocaleString()}{' '}
                        {t('common.pkr')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </Modal>
  );
}
