import {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
} from '@/store/api/clinicApi';
import { format } from 'date-fns';
import { TableSkeleton } from '../ui/Skeleton';
import { Calendar, Trash2 } from 'lucide-react';
import { EyeIcon, UserIcon } from '@/icons';
import { useEffect, useState } from 'react';
import AppointmentDetailModal from '../AppointmentDetailModal';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface AppointmentTableProps {
  filters: any;
}

export default function AppointmentTable({ filters }: AppointmentTableProps) {
  const t = useTranslations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading } = useGetAppointmentsQuery({
    ...filters,
    page,
    limit,
  });
  const { data: detailData, isLoading: isDetailLoading } =
    useGetAppointmentByIdQuery(selectedId!, {
      skip: !selectedId,
    });

  const appointments = data?.data?.appointments || [];
  const pagination = data?.data?.pagination;

  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
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

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-surface-cream text-[#B45309]  ',
      confirmed: 'bg-surface text-primary  ',
      completed: 'bg-surface text-primary  ',
      cancelled: 'bg-red-100 text-red-800  ',
      'in-progress': 'bg-surface-lavender text-primary  ',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] || styles.pending}`}
      >
        {getStatusLabel(status)}
      </span>
    );
  };

  if (isLoading) {
    return <TableSkeleton rows={8} />;
  }

  return (
    <>
      <div className='bg-white p-6 rounded-2xl border border-border-light lens-card'>
        <h2 className='text-xl font-black text-text-primary mb-6'>
          {t('clinic.appointments.title')}
        </h2>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-border-light'>
                <th className='text-left py-4 px-4 text-[10px] font-black text-text-primary uppercase tracking-widest'>
                  {t('clinic.appointments.patient')}
                </th>
                <th className='text-left py-4 px-4 text-[10px] font-black text-text-primary uppercase tracking-widest'>
                  {t('clinic.appointments.doctor')}
                </th>
                <th className='text-left py-4 px-4 text-[10px] font-black text-text-primary uppercase tracking-widest'>
                  {t('clinic.appointments.dateTime')}
                </th>
                <th className='text-left py-4 px-4 text-[10px] font-black text-text-primary uppercase tracking-widest'>
                  {t('clinic.appointments.type')}
                </th>
                <th className='text-center py-4 px-4 text-[10px] font-black text-text-primary uppercase tracking-widest'>
                  {t('clinic.appointments.status')}
                </th>
                <th className='text-right py-4 px-4 text-[10px] font-black text-text-primary uppercase tracking-widest'>
                  {t('clinic.appointments.actions')}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-50'>
              {appointments.map((appointment: any) => (
                <tr
                  key={appointment._id}
                  className='group hover:bg-background :bg-ink-soft/50 transition-colors'
                >
                  <td className='py-4 px-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-8 w-8 rounded-full bg-surface flex items-center justify-center text-text-primary overflow-hidden'>
                        {appointment.patientId?.photo ? (
                          <img
                            src={appointment.patientId.photo}
                            alt='P'
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <UserIcon size={16} />
                        )}
                      </div>
                      <span className='text-sm font-bold text-text-primary uppercase tracking-tight'>
                        {appointment.patientId?.name || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className='py-4 px-4'>
                    <span className='text-sm font-medium text-text-primary'>
                      Dr. {appointment.doctorId?.name || 'N/A'}
                    </span>
                  </td>
                  <td className='py-4 px-4'>
                    <div className='bg-surface px-3 py-1.5 rounded-lg inline-block'>
                      <span className='text-xs font-black text-text-primary'>
                        {appointment.dateTime
                          ? format(
                              new Date(appointment.dateTime),
                              'MMM dd • h:mm a',
                            )
                          : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-xs font-bold text-text-primary uppercase'>
                    {appointment.type || 'consultation'}
                  </td>
                  <td className='py-4 px-4 text-center'>
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <button
                        onClick={() => handleOpenDetail(appointment._id)}
                        className='p-2 rounded-lg bg-surface text-text-primary hover:text-primary hover:bg-primary/10 transition-all group/btn'
                      >
                        <EyeIcon
                          size={16}
                          className='group-hover/btn:scale-110 transition-transform'
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appointments.length === 0 && (
          <div className='flex flex-col items-center justify-center py-14 text-center mt-2 rounded-2xl bg-gray-50 border border-black/6'>
            <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
              <Calendar className='h-5 w-5 text-primary' />
            </div>
            <p className='text-sm font-medium text-text-primary'>
              {t('clinic.appointments.noAppointments')}
            </p>
            <p className='text-xs text-text-secondary mt-1'>
              Appointments will appear here once scheduled
            </p>
          </div>
        )}

        {pagination?.pages > 1 && (
          <div className='mt-6 flex items-center justify-between'>
            <p className='text-xs font-semibold text-text-primary'>
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                className='px-3 py-1.5 rounded-lg border border-border-light text-sm font-semibold disabled:opacity-50'
              >
                {t('common.back')}
              </button>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.pages))
                }
                disabled={page >= pagination.pages}
                className='px-3 py-1.5 rounded-lg border border-border-light text-sm font-semibold disabled:opacity-50'
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      <AppointmentDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={detailData?.data}
        loading={isDetailLoading}
      />
    </>
  );
}
