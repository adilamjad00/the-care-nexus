'use client';

import {
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useCompleteAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentByIdQuery,
} from '@/store/api/doctorApi';
import { toast } from 'react-hot-toast';
import { SuccessModal } from '@/components/ui/SuccessModal';
import {
  Calendar as CalendarLegacy,
  Play,
  AlertTriangle,
  Timer,
  Plus,
  Calendar,
  Loader2,
} from 'lucide-react';
import {
  EyeIcon,
  ClockIcon,
  TrashIcon,
  CheckedIcon,
  XIcon,
  UserIcon,
} from '@/icons';
import { TableSkeleton } from '@/components/ui/Skeleton';
import AppointmentDetailModal from '@/components/AppointmentDetailModal';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useTranslations } from 'next-intl';

const AppointmentTimer = ({ startTime }: { startTime: string }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [pauseOffset, setPauseOffset] = useState(0);
  const [lastTick, setLastTick] = useState(Date.now());

  useEffect(() => {
    const calculateTime = () => {
      if (isPaused) return;

      const start = new Date(startTime).getTime();
      const now = Date.now();
      const duration = 20 * 60 * 1000;
      const elapsed = now - start - pauseOffset;
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        setTimeLeft('Window Closed');
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startTime, isPaused, pauseOffset]);

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPaused) {
      setLastTick(Date.now());
    } else {
      const pausedFor = Date.now() - lastTick;
      setPauseOffset((prev) => prev + pausedFor);
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className='flex items-center gap-2'>
      <div
        className={`flex items-center gap-1.5 px-3 py-1 ${isPaused ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'} rounded-full text-[10px] font-bold uppercase tracking-widest border border-current/20 transition-colors`}
      >
        <Timer className={`h-3 w-3 ${!isPaused && 'animate-pulse'}`} />
        <span>{isPaused ? 'PAUSED' : timeLeft}</span>
      </div>
      <button
        onClick={togglePause}
        className={`h-6 w-6 flex items-center justify-center rounded-lg border transition-all ${isPaused ? 'bg-primary text-white border-primary active:scale-90' : 'bg-white dark:bg-[#1e293b] text-gray-400 border-gray-200 dark:border-white/10 hover:text-primary hover:border-primary/30'}`}
      >
        {isPaused ? (
          <Play size={10} className='fill-current ml-0.5' />
        ) : (
          <div className='flex gap-0.5'>
            <div className='w-0.5 h-2 bg-current' />
            <div className='w-0.5 h-2 bg-current' />
          </div>
        )}
      </button>
    </div>
  );
};

export default function AppointmentsPage() {
  const t = useTranslations();
  const [filter, setFilter] = useState<
    'all' | 'today' | 'yesterday' | 'tomorrow'
  >('all');
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string;
    patientName: string;
  }>({ open: false, id: '', patientName: '' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [successConfig, setSuccessConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [dismissedLateWarnings, setDismissedLateWarnings] = useState<string[]>(
    [],
  );
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    status: string;
  } | null>(null);

  const { data: allData, isLoading: allLoading } = useGetAppointmentsQuery({
    limit: 100,
  });
  const { data: detailData, isLoading: isDetailLoading } =
    useGetAppointmentByIdQuery(selectedId!, {
      skip: !selectedId,
    });

  const [updateStatus] = useUpdateAppointmentStatusMutation();
  const [completeAppointment] = useCompleteAppointmentMutation();
  const [deleteAppointment, { isLoading: deleting }] =
    useDeleteAppointmentMutation();

  const statusPriority: Record<string, number> = {
    completed: 5,
    'in-progress': 4,
    confirmed: 3,
    pending: 2,
    reserved: 1,
    cancelled: 0,
  };

  const appointments = (allData?.data?.appointments || [])
    .filter((a: any) => {
      if (filter === 'all') return true;
      const target = new Date();
      if (filter === 'yesterday') target.setDate(target.getDate() - 1);
      if (filter === 'tomorrow') target.setDate(target.getDate() + 1);
      return a.dateTime
        ? localDateStr(new Date(a.dateTime)) === localDateStr(target)
        : false;
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
  const loading = allLoading;

  const resolveImageUrl = (photo?: string | null) => {
    if (!photo) return '';
    const trimmed = String(photo).trim();
    if (!trimmed) return '';
    if (/^(https?:\/\/|data:)/i.test(trimmed)) return trimmed;

    // Use NEXT_PUBLIC_SOCKET_URL (base server without /api) for static uploads
    const baseOrigin =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(
        /\/api\/?$/,
        '',
      );

    const normalizedPath = trimmed.startsWith('/')
      ? trimmed
      : trimmed.startsWith('uploads/')
        ? `/${trimmed}`
        : `/uploads/${trimmed}`;
    try {
      return new URL(normalizedPath, baseOrigin).toString();
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('doctor-late-warning-dismissed');
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setDismissedLateWarnings(parsed);
      }
    } catch {
      setDismissedLateWarnings([]);
    }
  }, []);

  useEffect(() => {
    if (!appointments?.length) return;

    const now = Date.now();

    appointments.forEach((appointment: any) => {
      if (appointment.status !== 'confirmed') return;

      const startMs = new Date(appointment.dateTime).getTime();
      if (!startMs) return;

      const overdueMs = now - startMs;
      if (overdueMs <= 60 * 1000) return;

      const warningKey = `late-start-${appointment._id}`;
      if (dismissedLateWarnings.includes(warningKey)) return;

      const patientName = appointment.patientId?.name || 'Patient';
      const scheduledTime = new Date(appointment.dateTime).toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      );

      toast.custom(
        (t) => (
          <div className='w-[min(560px,calc(100vw-24px))] rounded-2xl border border-amber-300/50 bg-amber-50 dark:bg-amber-950/60 px-4 py-3 '>
            <div className='flex items-start gap-3'>
              <div className='relative mt-0.5 h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center border border-amber-300/40'>
                <ClockIcon className='h-4 w-4 text-amber-700 dark:text-amber-300 animate-pulse' />
                <span className='absolute h-1.5 w-1.5 rounded-full bg-amber-600 animate-ping' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-black uppercase tracking-wider text-amber-800 dark:text-amber-200'>
                  Appointment Start Delayed
                </p>
                <p className='text-sm font-medium text-amber-700/90 dark:text-amber-100 mt-1'>
                  {patientName}'s appointment was scheduled for {scheduledTime}{' '}
                  and is overdue by more than 1 minute.
                </p>
              </div>
              <button
                onClick={() => {
                  const next = [...dismissedLateWarnings, warningKey];
                  setDismissedLateWarnings(next);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(
                      'doctor-late-warning-dismissed',
                      JSON.stringify(next),
                    );
                  }
                  toast.dismiss(t.id);
                }}
                className='px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors'
              >
                Dismiss
              </button>
            </div>
          </div>
        ),
        {
          id: warningKey,
          duration: Infinity,
          position: 'top-center',
        },
      );
    });
  }, [appointments, dismissedLateWarnings]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setPendingAction({ id, status });
    try {
      if (status === 'completed') {
        await completeAppointment({ id }).unwrap();
      } else {
        await updateStatus({ id, status }).unwrap();
      }
      const appointment = (allData?.data?.appointments || []).find(
        (a: any) => a._id === id,
      );
      const patientName = appointment?.patientId?.name || 'Patient';

      if (status === 'confirmed') {
        setSuccessConfig({
          isOpen: true,
          title: 'Appointment Confirmed',
          message: `You have successfully confirmed the appointment with ${patientName}.`,
        });
      } else if (status === 'cancelled') {
        setSuccessConfig({
          isOpen: true,
          title: 'Appointment Cancelled',
          message: `The appointment with ${patientName} has been cancelled.`,
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Operation failed');
    } finally {
      setPendingAction(null);
    }
  };

  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    setIsDetailOpen(true);
  };

  const getStatusLabel = (status: string) => {
    const normalized = String(status || '')
      .trim()
      .toLowerCase();
    const key = `common.status.${normalized}`;
    const translated = t(key);
    return translated === key ? status : translated;
  };

  if (loading)
    return (
      <div className='space-y-6'>
        <TableSkeleton rows={6} />
      </div>
    );

  // Local date comparison — avoids UTC shift (same fix as patient appointments)
  const localDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return (
    <div className='space-y-5 animate-in'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl font-bold text-text-primary'>
            {t('doctor.appointments.title')}
          </h1>
          <p className='text-sm text-text-secondary mt-0.5'>
            {t('doctor.appointments.subtitle')}
          </p>
        </div>
        <Link
          href='/dashboard/doctor/appointments/new'
          className='inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors'
        >
          <Plus className='h-4 w-4' />
          <span>{t('doctor.appointments.newAppointment')}</span>
        </Link>
      </div>

      <div className='flex gap-2 overflow-x-auto pb-1'>
        {['all', 'yesterday', 'today', 'tomorrow'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors shrink-0 ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary border border-black/6 hover:text-text-primary hover:border-primary/30'
            }`}
          >
            {f === 'all' ? t('common.all') : t(`common.${f}`)}
          </button>
        ))}
      </div>

      <div className='space-y-3'>
        {appointments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-gray-50 border border-black/6'>
            <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
              <Calendar className='h-5 w-5 text-primary' />
            </div>
            <p className='text-sm font-medium text-text-primary'>
              {t('doctor.appointments.noAppointments')}
            </p>
            <p className='text-xs text-text-secondary mt-1'>
              {t('doctor.appointments.adjustFilters')}
            </p>
          </div>
        ) : (
          appointments.map((appointment: any) => {
            const patientName = appointment.patientId?.name || 'Patient';
            const patientEmail = appointment.patientId?.email || '';
            const dt = new Date(appointment.dateTime);
            const dateStr = dt.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = dt.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const imageUrl = resolveImageUrl(appointment.patientId?.photo);

            const statusStyleMap: Record<string, string> = {
              pending: 'bg-amber-50 text-amber-700 border-amber-200',
              confirmed: 'bg-primary/8 text-primary border-primary/20',
              'in-progress': 'bg-violet-50 text-violet-700 border-violet-200',
              completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              cancelled: 'bg-red-50 text-red-600 border-red-200',
            };
            const statusStyle =
              statusStyleMap[appointment.status] ??
              'bg-gray-100 text-text-secondary border-black/6';

            return (
              <div
                key={appointment._id}
                className='lens-card rounded-2xl border border-black/6 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow group'
              >
                {/* Avatar */}
                <div className='h-11 w-11 rounded-xl overflow-hidden border border-black/6 bg-gray-100 flex items-center justify-center shrink-0'>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={patientName}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          'none';
                      }}
                    />
                  ) : (
                    <UserIcon className='h-5 w-5 text-text-muted' />
                  )}
                </div>

                {/* Patient info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p className='text-sm font-semibold text-text-primary truncate'>
                      {patientName}
                    </p>
                    {appointment.status === 'in-progress' && (
                      <AppointmentTimer startTime={appointment.updatedAt} />
                    )}
                  </div>
                  {patientEmail && (
                    <p className='text-xs text-text-secondary mt-0.5 truncate'>
                      {patientEmail}
                    </p>
                  )}
                  <div className='flex items-center gap-2 mt-2 flex-wrap'>
                    <span className='inline-flex items-center gap-1.5 text-xs text-text-secondary'>
                      <ClockIcon size={12} className='text-primary' />
                      {dateStr} · {timeStr}
                    </span>
                    <span className='text-xs text-text-muted capitalize'>
                      {appointment.type || 'consultation'}
                    </span>
                  </div>
                  {appointment.status === 'completed' &&
                    appointment.patientFeedback?.score && (
                      <div className='flex items-center gap-1 mt-2'>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-3 w-3 ${i < appointment.patientFeedback.score ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                        {appointment.patientFeedback.comment && (
                          <span className='text-xs text-text-secondary ml-1 italic'>
                            "{appointment.patientFeedback.comment}"
                          </span>
                        )}
                      </div>
                    )}
                </div>

                {/* Status + actions */}
                <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0'>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold border capitalize ${statusStyle}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>

                  {appointment.status === 'pending' && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(appointment._id, 'confirmed')
                      }
                      disabled={pendingAction?.id === appointment._id}
                      className='h-8 w-8 rounded-lg bg-primary/8 text-primary hover:bg-primary/15 transition-colors flex items-center justify-center disabled:opacity-50'
                      title='Confirm'
                    >
                      {pendingAction?.id === appointment._id ? (
                        <Loader2 size={14} className='animate-spin' />
                      ) : (
                        <CheckedIcon size={14} strokeWidth={2.5} />
                      )}
                    </button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(appointment._id, 'in-progress')
                      }
                      disabled={pendingAction?.id === appointment._id}
                      className='inline-flex items-center gap-1.5 rounded-xl bg-primary text-white px-3 py-1.5 text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50'
                    >
                      {pendingAction?.id === appointment._id ? (
                        <Loader2 size={12} className='animate-spin' />
                      ) : (
                        <Play size={12} className='fill-current' />
                      )}
                      Start
                    </button>
                  )}
                  {appointment.status === 'in-progress' && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(appointment._id, 'completed')
                        }
                        disabled={pendingAction?.id === appointment._id}
                        className='inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50'
                      >
                        {pendingAction?.id === appointment._id ? (
                          <Loader2 size={12} className='animate-spin' />
                        ) : (
                          <CheckedIcon size={12} strokeWidth={2.5} />
                        )}
                        Complete
                      </button>
                      <Link
                        href={`/dashboard/doctor/prescriptions/new?patientId=${appointment.patientId?._id || appointment.patientId}&appointmentId=${appointment._id}`}
                      >
                        <button className='rounded-xl bg-primary/8 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary/15 transition-colors'>
                          {t('nav.prescriptions')}
                        </button>
                      </Link>
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <Link
                      href={`/dashboard/doctor/prescriptions/new?patientId=${appointment.patientId?._id || appointment.patientId}&appointmentId=${appointment._id}`}
                    >
                      <button className='rounded-xl border border-primary/20 text-primary px-3 py-1.5 text-xs font-semibold hover:bg-primary/5 transition-colors'>
                        {t('doctor.prescriptions.newPrescription')}
                      </button>
                    </Link>
                  )}

                  <Link
                    href={`/dashboard/doctor/appointments/${appointment._id}`}
                    className='h-8 w-8 rounded-lg bg-gray-100 text-text-secondary hover:bg-primary/8 hover:text-primary transition-colors flex items-center justify-center'
                    title={t('doctor.appointments.viewDetails')}
                  >
                    <EyeIcon size={14} />
                  </Link>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        id: appointment._id,
                        patientName,
                      })
                    }
                    className='h-8 w-8 rounded-lg bg-gray-100 text-text-secondary hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center'
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <AppointmentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        appointment={detailData?.data}
        loading={isDetailLoading}
      />

      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: '', patientName: '' })}
        onConfirm={async () => {
          await deleteAppointment(deleteModal.id);
          setDeleteModal({ open: false, id: '', patientName: '' });
        }}
        title={t('modal.confirmDelete')}
        message={`${t('doctor.appointments.confirmCancel')} (${deleteModal.patientName})`}
      />
      <SuccessModal
        isOpen={successConfig.isOpen}
        onClose={() => setSuccessConfig((prev) => ({ ...prev, isOpen: false }))}
        title={successConfig.title}
        message={successConfig.message}
      />
    </div>
  );
}
