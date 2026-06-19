'use client';

import Link from 'next/link';
import { Calendar, Clock, Building2 } from 'lucide-react';

interface Appointment {
  _id: string;
  dateTime: string;
  reason: string;
  status: string;
  doctorId: {
    name?: string;
    doctorProfile?: {
      fullName?: string;
      specialization?: string;
    };
  };
  clinicId?: {
    name?: string;
    address?: string;
  };
}

interface UpcomingAppointmentsWidgetProps {
  appointments: Appointment[];
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useFormatter, useTranslations } from 'next-intl';

export default function UpcomingAppointmentsWidget({
  appointments,
}: UpcomingAppointmentsWidgetProps) {
  const t = useTranslations();
  const format = useFormatter();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format.dateTime(date, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format.dateTime(date, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-surface/50 text-primary  ';
      case 'pending':
        return 'bg-surface-cream/50 text-[#B45309]  ';
      case 'cancelled':
        return 'bg-red-100/50 text-red-700  ';
      case 'completed':
        return 'bg-surface/50 text-primary  ';
      default:
        return 'bg-surface/50 text-text-primary  ';
    }
  };

  const getDoctorName = (appointment: Appointment) => {
    return (
      appointment.doctorId?.doctorProfile?.fullName ||
      appointment.doctorId?.name ||
      'Doctor'
    );
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-xl'>
          {t('patient.upcomingAppointments')}
        </CardTitle>
        <Link
          href='/dashboard/patient/appointments'
          className='text-sm font-bold text-primary hover:underline hover:underline-offset-4'
        >
          {t('patient.dashboard.viewAll')}
        </Link>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
              <Calendar className='h-5 w-5 text-primary' />
            </div>
            <p className='text-sm font-medium text-text-primary mb-1'>
              {t('patient.dashboard.noUpcoming')}
            </p>
            <p className='text-xs text-text-secondary mb-4'>
              Your upcoming appointments will appear here
            </p>
            <Link
              href='/dashboard/patient/book-appointment'
              className='inline-flex items-center rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors'
            >
              {t('patient.dashboard.bookNow')}
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            {appointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment._id}
                className='rounded-xl bg-gray-50 p-4 hover:bg-gray-100 transition-all'
              >
                <div className='flex items-start justify-between gap-2 mb-2'>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-text-primary truncate'>
                      {t('patient.bookAppointmentPage.doctorPrefix')}{' '}
                      {getDoctorName(appointment)}
                    </p>
                    <p className='text-xs text-text-secondary mt-0.5'>
                      {appointment.doctorId?.doctorProfile?.specialization ||
                        t('appointment.doctor')}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusColor(appointment.status)}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <div className='flex items-center gap-3 text-xs text-text-secondary flex-wrap mt-2'>
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5 text-primary' />
                    {appointment.dateTime
                      ? formatDate(appointment.dateTime)
                      : 'TBD'}
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Clock className='h-3.5 w-3.5 text-primary' />
                    {appointment.dateTime
                      ? formatTime(appointment.dateTime)
                      : 'TBD'}
                  </div>
                  {appointment.clinicId?.name && (
                    <div className='flex items-center gap-1.5'>
                      <Building2 className='h-3.5 w-3.5' />
                      {appointment.clinicId.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
