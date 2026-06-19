'use client';

import { useState, useEffect } from 'react';
import {
  useGetAppointmentsQuery,
  useCancelAppointmentMutation,
  useSubmitReviewMutation,
  useUpdateReviewMutation,
  useDeleteAppointmentMutation,
} from '@/store/api/patientApi';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Building2,
  MapPin,
  Plus,
  X,
  Star,
  Trash2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { showToast } from '@/lib/toast';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  doctorId: string;
  reviewId?: string;
  initialRating?: number;
  initialComment?: string;
}

function RatingModal({
  isOpen,
  onClose,
  appointmentId,
  doctorId,
  reviewId,
  initialRating,
  initialComment,
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating || 5);
  const [comment, setComment] = useState(initialComment || '');
  const t = useTranslations();
  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const isLoading = isSubmitting || isUpdating;

  const handleSubmit = async () => {
    try {
      if (reviewId) {
        await updateReview({ id: reviewId, rating, comment }).unwrap();
        toast.success('Your review has been updated.');
      } else {
        await submitReview({
          doctorId,
          appointmentId,
          rating,
          comment,
        }).unwrap();
        toast.success('Thank you! Your review has been submitted.');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save review');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200'>
        <h3 className='text-xl font-bold text-text-primary mb-2'>
          {reviewId
            ? t('patient.appointments.rating.updateTitle')
            : t('patient.appointments.rating.title')}
        </h3>
        <p className='text-sm text-text-secondary mb-6'>
          {t('patient.appointments.rating.subtitle')}
        </p>

        <div className='flex justify-center gap-2 mb-6'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className='p-1 transition-all'
            >
              <Star
                className={`h-10 w-10 ${
                  star <= rating
                    ? 'fill-primary text-primary'
                    : 'text-white/70 '
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder={t('patient.appointments.rating.placeholder')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='w-full rounded-lg border border-border-light bg-background p-3 text-sm mb-6 h-32 resize-none'
        />

        <div className='flex gap-3'>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className='flex-1'
          >
            {isLoading
              ? t('patient.appointments.rating.saving')
              : reviewId
                ? t('patient.appointments.rating.update')
                : t('patient.appointments.rating.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}

type ViewFilter =
  | 'all'
  | 'upcoming'
  | 'past'
  | 'today'
  | 'yesterday'
  | 'tomorrow';

const AppointmentTimer = ({ startTime }: { startTime: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const duration = 20 * 60 * 1000;
      const elapsed = now - start;
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        setTimeLeft('Ending soon');
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs} left`);
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className='flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20'>
      <Clock className='h-3 w-3 animate-pulse' />
      {timeLeft}
    </div>
  );
};

export default function AppointmentsPage() {
  const t = useTranslations();
  const [view, setView] = useState<ViewFilter>('all');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    id: string;
    doctorId: string;
    reviewId?: string;
    initialRating?: number;
    initialComment?: string;
  }>({ isOpen: false, id: '', doctorId: '' });

  const { data, isLoading } = useGetAppointmentsQuery(
    ['today', 'yesterday', 'tomorrow'].includes(view) ? 'all' : view,
  );
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  const statusPriority: Record<string, number> = {
    completed: 5,
    'in-progress': 4,
    confirmed: 3,
    pending: 2,
    reserved: 1,
    cancelled: 0,
  };

  // Use local date string (YYYY-MM-DD) to avoid UTC timezone shift issues
  const localDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const appointments = (data?.data || [])
    .filter((a: any) => {
      if (['all', 'upcoming', 'past'].includes(view)) return true;
      const target = new Date();
      if (view === 'yesterday') target.setDate(target.getDate() - 1);
      if (view === 'tomorrow') target.setDate(target.getDate() + 1);
      const targetStr = localDateStr(target);
      // Compare using local date of the appointment, not UTC
      const apptLocal = a.dateTime ? localDateStr(new Date(a.dateTime)) : '';
      return apptLocal === targetStr;
    })
    .reduce((list: any[], appointment: any) => {
      const slotKey = `${appointment.patientId?._id || appointment.patientId}-${appointment.doctorId?._id || appointment.doctorId}-${String(appointment.dateTime || '')}`;
      const existingIndex = list.findIndex(
        (item) =>
          `${item.patientId?._id || item.patientId}-${item.doctorId?._id || item.doctorId}-${String(item.dateTime || '')}` ===
          slotKey,
      );

      if (existingIndex === -1) {
        list.push(appointment);
        return list;
      }

      const existing = list[existingIndex];
      const nextPriority =
        statusPriority[String(appointment.status || '').toLowerCase()] ?? -1;
      const currentPriority =
        statusPriority[String(existing.status || '').toLowerCase()] ?? -1;

      if (
        nextPriority > currentPriority ||
        (nextPriority === currentPriority &&
          new Date(appointment.updatedAt || 0).getTime() >
            new Date(existing.updatedAt || 0).getTime())
      ) {
        list[existingIndex] = appointment;
      }

      return list;
    }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDoctorName = (appointment: any) => {
    const raw =
      appointment.doctorId?.name || appointment.doctorId?.fullName || 'Doctor';
    // Strip existing "Dr." prefix so the template can add it once
    return raw.replace(/^Dr\.?\s+/i, '');
  };

  const getClinicCity = (appointment: any) => {
    const directCity =
      appointment.clinicId?.city ||
      appointment.clinic?.city ||
      appointment.clinicCity;
    if (directCity) return directCity;

    const address =
      appointment.clinicId?.address ||
      appointment.clinic?.address ||
      appointment.clinicAddress;
    if (!address || typeof address !== 'string') return t('common.noData');

    const parts = address
      .split(',')
      .map((p: string) => p.trim())
      .filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : t('common.noData');
  };

  const getClinicName = (appointment: any) => {
    return (
      appointment.clinicId?.name ||
      appointment.clinic?.name ||
      appointment.clinicName ||
      t('appointment.clinic')
    );
  };

  const getClinicAddress = (appointment: any) => {
    return (
      appointment.clinicId?.address ||
      appointment.clinic?.address ||
      appointment.clinicAddress ||
      t('common.noData')
    );
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'lens-badge-active';
      case 'pending':
        return 'lens-badge-pending';
      case 'cancelled':
        return 'lens-badge-danger';
      case 'completed':
        return 'lens-badge-completed';
      case 'in-progress':
        return 'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/20';
      default:
        return 'lens-badge-neutral';
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId).unwrap();
      showToast.appointmentCancelled(t);
      setConfirmCancelId(null);
    } catch (error: any) {
      showToast.error(t, error?.data?.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAppointment(deleteId).unwrap();
      toast.success('Record deleted');
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete appointment');
    }
  };

  return (
    <div className='relative isolate -mx-4 min-h-[calc(100vh-8rem)] overflow-hidden sm:-mx-6 lg:-mx-8 '>
      <div className='relative z-10 space-y-6 overflow-x-hidden px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-xl font-bold text-text-primary'>
            {t('nav.appointments')}
          </h1>
          <Link href='/dashboard/patient/book-appointment'>
            <Button className='w-full sm:w-auto rounded-xl text-sm font-semibold'>
              <Plus className='mr-2 h-4 w-4' />
              {t('patient.bookAppointment')}
            </Button>
          </Link>
        </div>

        {/* View Filters */}
        <div className='flex gap-2 overflow-x-auto pb-1'>
          {(
            [
              'all',
              'upcoming',
              'past',
              'yesterday',
              'today',
              'tomorrow',
            ] as ViewFilter[]
          ).map((filter) => (
            <button
              key={filter}
              onClick={() => setView(filter)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors shrink-0 ${
                view === filter
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-secondary border border-black/6 hover:text-text-primary hover:border-primary/30'
              }`}
            >
              {filter === 'all'
                ? t('common.all')
                : filter === 'upcoming'
                  ? t('patient.appointments.upcoming')
                  : filter === 'past'
                    ? t('patient.appointments.past')
                    : t(`common.${filter}`)}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-40 animate-pulse rounded-2xl border border-border-light  lens-card'
              />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-gray-50 border border-black/6 lens-card'>
            <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
              <Calendar className='h-5 w-5 text-primary' />
            </div>
            <p className='text-sm font-medium text-text-primary'>
              {t('appointment.noAppointments')}
            </p>
            <p className='text-xs text-text-secondary mt-1'>
              {view === 'upcoming'
                ? t('appointment.noUpcoming')
                : view === 'past'
                  ? t('appointment.noPast')
                  : 'Your appointments will appear here'}
            </p>
            {view !== 'upcoming' && (
              <Link href='/dashboard/patient/book-appointment' className='mt-5'>
                <Button className='rounded-xl text-sm font-semibold'>
                  {t('patient.bookAppointment')}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {appointments.map((appointment: any) => (
              <div
                key={appointment._id}
                className='rounded-2xl border border-border-light bg-white p-5 sm:p-8 transition-all hover:border-primary/20 hover:bg-background group lens-card'
              >
                <div className='flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-start gap-4 sm:gap-6'>
                      <div className='rounded-2xl bg-slate-100 dark:bg-zinc-800 h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center overflow-hidden shrink-0 border-2 border-black/5'>
                        {appointment.doctorId?.photo ? (
                          <img
                            src={appointment.doctorId.photo}
                            alt='Doctor'
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <User className='h-8 w-8 sm:h-10 sm:w-10 text-primary' />
                        )}
                      </div>
                      <div className='flex-1 min-w-0 max-w-full'>
                        <div className='mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                          <div className='min-w-0'>
                            <h3 className='text-xl sm:text-2xl font-black text-text-primary tracking-tight truncate'>
                              {t('common.doctorPrefix')}{' '}
                              {getDoctorName(appointment)}
                            </h3>
                            <p className='text-[10px] font-semibold text-primary uppercase tracking-widest mt-0.5 sm:mt-1'>
                              {appointment.doctorId?.doctorProfile
                                ?.specialization || 'General Physician'}
                            </p>
                          </div>
                          <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto'>
                            <span
                              className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${getStatusColor(
                                appointment.status,
                              )}`}
                            >
                              {getStatusLabel(appointment.status)}
                            </span>
                            {appointment.status === 'in-progress' && (
                              <AppointmentTimer
                                startTime={appointment.updatedAt}
                              />
                            )}
                          </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6'>
                          <div className='space-y-4'>
                            <div className='flex items-center gap-3'>
                              <div className='h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-text-primary'>
                                <Building2 className='h-4 w-4' />
                              </div>
                              <div>
                                <p className='text-[10px] font-black text-text-primary uppercase tracking-widest opacity-40'>
                                  {t('appointment.clinic')}
                                </p>
                                <p className='text-sm font-bold text-text-primary'>
                                  {getClinicName(appointment)}
                                </p>
                              </div>
                            </div>
                            <div className='flex items-center gap-3'>
                              <div className='h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-text-primary'>
                                <MapPin className='h-4 w-4' />
                              </div>
                              <div>
                                <p className='text-[10px] font-black text-text-primary uppercase tracking-widest opacity-40'>
                                  {t('form.address')}
                                </p>
                                <p className='text-sm font-bold text-text-primary line-clamp-1'>
                                  {getClinicAddress(appointment)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className='space-y-4'>
                            <div className='flex items-center gap-3'>
                              <div className='h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-text-primary'>
                                <Calendar className='h-4 w-4' />
                              </div>
                              <div>
                                <p className='text-[10px] font-black text-text-primary uppercase tracking-widest opacity-40'>
                                  {t('form.date')}
                                </p>
                                <p className='text-sm font-bold text-text-primary'>
                                  {formatDate(appointment.dateTime)}
                                </p>
                              </div>
                            </div>
                            <div className='flex items-center gap-3'>
                              <div className='h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-text-primary'>
                                <Clock className='h-4 w-4' />
                              </div>
                              <div>
                                <p className='text-[10px] font-black text-text-primary uppercase tracking-widest opacity-40'>
                                  {t('form.time')}
                                </p>
                                <p className='text-sm font-bold text-text-primary'>
                                  {formatTime(appointment.dateTime)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {appointment.reason && (
                          <div className='mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl border border-border-light relative overflow-hidden group/reason'>
                            <div className='absolute top-0 left-0 w-1 h-full bg-primary/20' />
                            <p className='text-[10px] font-black text-primary uppercase tracking-widest mb-1.5 sm:mb-2'>
                              {t('patient.bookAppointmentPage.reasonForVisit')}
                            </p>
                            <p className='text-xs sm:text-sm font-bold text-text-primary leading-relaxed'>
                              {appointment.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-3 pt-2 lg:w-48 lg:shrink-0 w-full max-w-full'>
                    {appointment.status === 'completed' && (
                      <>
                        {appointment.patientFeedback?.score ||
                        appointment.rating?.score ||
                        appointment.reviewId ? (
                          <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2 flex-1 h-12 bg-white border border-border-light rounded-2xl px-4'>
                              <Star className='h-4 w-4 fill-primary text-primary' />
                              <span className='text-sm font-black text-primary'>
                                {appointment.patientFeedback?.score ||
                                  appointment.rating?.score}{' '}
                                / 5
                              </span>
                            </div>
                            {((appointment.reviewEditCount || 0) < 1 ||
                              !appointment.reviewId) && (
                              <Button
                                variant='outline'
                                size='icon'
                                onClick={() => {
                                  const docId =
                                    appointment.doctorId?._id ||
                                    appointment.doctorId;
                                  setRatingModal({
                                    isOpen: true,
                                    id: appointment._id,
                                    doctorId: docId,
                                    reviewId: appointment.reviewId,
                                    initialRating:
                                      appointment.patientFeedback?.score ||
                                      appointment.rating?.score,
                                    initialComment:
                                      appointment.patientFeedback?.comment ||
                                      appointment.rating?.feedback,
                                  });
                                }}
                                className='h-12 w-12 rounded-2xl border-primary/20 text-primary'
                              >
                                <Star className='h-4 w-4' />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant='default'
                            onClick={() => {
                              const docId =
                                appointment.doctorId?._id ||
                                appointment.doctorId;
                              setRatingModal({
                                isOpen: true,
                                id: appointment._id,
                                doctorId: docId,
                              });
                            }}
                            className='h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-primary text-white shadow-lg shadow-primary/20'
                          >
                            <Star className='mr-2 h-4 w-4 fill-white' />
                            {t('patient.appointments.rateExperience')}
                          </Button>
                        )}
                        {appointment.prescriptionId && (
                          <Link
                            href={`/dashboard/patient/records/${appointment.prescriptionId._id || appointment.prescriptionId}`}
                          >
                            <Button
                              variant='outline'
                              className='w-full h-12 rounded-2xl border-primary text-primary hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[10px] transition-all'
                            >
                              <FileText className='mr-2 h-4 w-4' />
                              {t('nav.medicalRecords')}
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant='outline'
                          onClick={() => setDeleteId(appointment._id)}
                          className='h-12 rounded-2xl text-text-primary hover:text-red-500 hover:bg-red-50 border-border-light font-black uppercase tracking-widest text-[10px]'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          {t('common.delete')}
                        </Button>
                      </>
                    )}

                    {['cancelled', 'reserved', 'pending'].includes(
                      appointment.status,
                    ) && (
                      <div className='flex flex-col gap-3'>
                        {appointment.status === 'pending' &&
                          (confirmCancelId === appointment._id ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                              <Button
                                variant='outline'
                                onClick={() => handleCancel(appointment._id)}
                                disabled={isCancelling}
                                className='h-12 rounded-2xl text-red-600 border-red-200 hover:bg-red-50 font-black uppercase tracking-widest text-[10px]'
                              >
                                {isCancelling
                                  ? t('patient.appointments.cancelling')
                                  : t('patient.appointments.confirmCancelBtn')}
                              </Button>
                              <Button
                                variant='outline'
                                className='h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]'
                                onClick={() => setConfirmCancelId(null)}
                              >
                                {t('patient.appointments.keepBtn')}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant='outline'
                              onClick={() =>
                                setConfirmCancelId(appointment._id)
                              }
                              className='h-12 rounded-2xl text-red-600 border-red-200 hover:bg-red-50 font-black uppercase tracking-widest text-[10px]'
                            >
                              <X className='mr-2 h-4 w-4' />
                              {t('common.cancel')}
                            </Button>
                          ))}
                        <Button
                          variant='outline'
                          onClick={() => setDeleteId(appointment._id)}
                          className='h-12 rounded-2xl text-text-primary hover:text-red-500 hover:bg-red-50 border-border-light font-black uppercase tracking-widest text-[10px]'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          {t('common.delete')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {ratingModal.isOpen && (
          <RatingModal
            isOpen={ratingModal.isOpen}
            onClose={() =>
              setRatingModal({
                isOpen: false,
                id: '',
                doctorId: '',
                reviewId: undefined,
                initialRating: undefined,
                initialComment: undefined,
              })
            }
            appointmentId={ratingModal.id}
            doctorId={ratingModal.doctorId}
            reviewId={ratingModal.reviewId}
            initialRating={ratingModal.initialRating}
            initialComment={ratingModal.initialComment}
          />
        )}

        <ConfirmationModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title={t('common.delete')}
          message={t('modal.cannotUndo')}
        />
      </div>
    </div>
  );
}
