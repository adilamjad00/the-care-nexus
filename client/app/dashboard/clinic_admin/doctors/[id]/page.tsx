'use client';

import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import {
  useGetDoctorsQuery,
  useGetDoctorStatsQuery,
  useGetSettingsQuery,
} from '@/store/api/clinicApi';

function DoctorDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const doctorId = params.id as string;
  const fromAppointment = searchParams.get('fromAppointment');

  const backLink = fromAppointment
    ? `/dashboard/clinic_admin/appointments/${fromAppointment}`
    : '/dashboard/clinic_admin/doctors';
  const backLabel = fromAppointment ? 'Back to appointment' : 'Back to doctors';

  const { data: doctorsResponse, isLoading: isDoctorsLoading } =
    useGetDoctorsQuery(undefined);
  const { data: statsResponse, isLoading: isStatsLoading } =
    useGetDoctorStatsQuery(doctorId, {
      skip: !doctorId,
    });
  const { data: settingsResponse } = useGetSettingsQuery(undefined);

  const doctor = useMemo(() => {
    const doctors =
      doctorsResponse?.data?.doctors || doctorsResponse?.data || [];
    return doctors.find((item: any) => String(item._id) === String(doctorId));
  }, [doctorId, doctorsResponse]);

  const stats = statsResponse?.data;

  if (isDoctorsLoading || isStatsLoading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='h-52 bg-surface rounded-2xl' />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='h-28 bg-surface rounded-2xl' />
          <div className='h-28 bg-surface rounded-2xl' />
          <div className='h-28 bg-surface rounded-2xl' />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className='space-y-6'>
        <Link
          href={backLink}
          className='inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary'
        >
          <ArrowLeft className='h-4 w-4' />
          {backLabel}
        </Link>
        <div className='rounded-2xl border border-border-light bg-white p-8 text-center'>
          <p className='text-text-secondary font-medium'>Doctor not found.</p>
        </div>
      </div>
    );
  }

  const doctorPhoto = doctor.userId?.photo || doctor.photo || '';
  const clinicName =
    doctor.clinicId?.name ||
    settingsResponse?.data?.name ||
    'The Care Nexus Clinic';
  const clinicAddress =
    settingsResponse?.data?.address || 'The Care Nexus Clinic Location';

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Link
          href={backLink}
          className='inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          {backLabel}
        </Link>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1 text-[10px] font-bold tracking-wider text-primary'>
          <ShieldCheck className='h-3.5 w-3.5' />
          Clinic Doctor
        </span>
      </div>

      <div className='overflow-hidden rounded-2xl border border-border-light bg-white'>
        <div className='border-b border-border-light bg-white p-6 md:p-8'>
          <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-5'>
              <div className='h-24 w-24 overflow-hidden rounded-2xl border-4 border-surface bg-primary/10'>
                {doctorPhoto ? (
                  <img
                    src={doctorPhoto}
                    alt={doctor.fullName || doctor.userId?.name}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-primary'>
                    <Users className='h-10 w-10' />
                  </div>
                )}
              </div>
              <div>
                <p className='text-xs font-bold tracking-wider text-text-secondary'>
                  Doctor profile
                </p>
                <h1 className='mt-2 text-3xl font-black tracking-tight text-text-primary'>
                  {doctor.userId?.name || doctor.fullName}
                </h1>
                <p className='mt-1 text-sm font-semibold text-primary'>
                  {doctor.specialization || 'General Physician'}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
              <div className='rounded-2xl border border-border-light bg-white p-4 text-center'>
                <p className='text-[10px] font-bold tracking-wider text-text-secondary'>
                  Rating
                </p>
                <p className='mt-2 text-2xl font-black text-text-primary'>
                  {stats?.averageRating || doctor.averageRating || '4.8'}
                </p>
              </div>
              <div className='rounded-2xl border border-border-light bg-white p-4 text-center'>
                <p className='text-[10px] font-bold tracking-wider text-text-secondary'>
                  Reviews
                </p>
                <p className='mt-2 text-2xl font-black text-text-primary'>
                  {stats?.totalReviews || doctor.totalReviews || 0}
                </p>
              </div>
              <div className='rounded-2xl border border-border-light bg-white p-4 text-center'>
                <p className='text-[10px] font-bold tracking-wider text-text-secondary'>
                  Completed
                </p>
                <p className='mt-2 text-2xl font-black text-text-primary'>
                  {stats?.appointmentsCompleted || 0}
                </p>
              </div>
              <div className='rounded-2xl border border-border-light bg-white p-4 text-center'>
                <p className='text-[10px] font-bold tracking-wider text-text-secondary'>
                  Patients
                </p>
                <p className='mt-2 text-2xl font-black text-text-primary'>
                  {stats?.uniquePatients || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 p-6 md:grid-cols-3 md:p-8'>
          <div className='rounded-2xl border border-border-light bg-white p-5'>
            <div className='flex items-center gap-3 text-text-secondary'>
              <Building2 className='h-5 w-5 text-primary' />
              <span className='text-xs font-bold tracking-wider'>Clinic</span>
            </div>
            <p className='mt-3 text-sm font-bold text-text-primary'>
              {clinicName}
            </p>
          </div>
          <div className='rounded-2xl border border-border-light bg-white p-5'>
            <div className='flex items-center gap-3 text-text-secondary'>
              <MapPin className='h-5 w-5 text-primary' />
              <span className='text-xs font-bold tracking-wider'>Location</span>
            </div>
            <p className='mt-3 text-sm font-bold text-text-primary'>
              {doctor.location?.address ||
                doctor.clinicId?.address ||
                clinicAddress}
            </p>
          </div>
          <div className='rounded-2xl border border-border-light bg-white p-5'>
            <div className='flex items-center gap-3 text-text-secondary'>
              <Phone className='h-5 w-5 text-primary' />
              <span className='text-xs font-bold tracking-wider'>Contact</span>
            </div>
            <p className='mt-3 text-sm font-bold text-text-primary'>
              {doctor.userId?.phone ||
                doctor.phone ||
                doctor.phoneNumber ||
                'Not provided'}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 border-t border-border-light p-6 md:grid-cols-3 md:p-8'>
          <div className='rounded-2xl border border-border-light bg-white p-5'>
            <div className='flex items-center gap-3'>
              <CalendarDays className='h-5 w-5 text-primary' />
              <span className='text-xs font-bold tracking-wider text-text-secondary'>
                Joined
              </span>
            </div>
            <p className='mt-3 text-sm font-bold text-text-primary'>
              {doctor.createdAt
                ? format(new Date(doctor.createdAt), 'MMMM dd, yyyy')
                : 'Not available'}
            </p>
          </div>
          <div className='rounded-2xl border border-border-light bg-white p-5'>
            <div className='flex items-center gap-3'>
              <Clock3 className='h-5 w-5 text-primary' />
              <span className='text-xs font-bold tracking-wider text-text-secondary'>
                Average visit
              </span>
            </div>
            <p className='mt-3 text-sm font-bold text-text-primary'>
              {stats?.avgVisitTime || stats?.averageVisitTime || '--'}
            </p>
          </div>
          <div className='rounded-2xl border border-border-light bg-white p-5'>
            <div className='flex items-center gap-3'>
              <Star className='h-5 w-5 text-primary' />
              <span className='text-xs font-bold tracking-wider text-text-secondary'>
                Satisfaction
              </span>
            </div>
            <p className='mt-3 text-sm font-bold text-text-primary'>
              {stats?.patientSatisfaction || 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDetailPage() {
  return (
    <Suspense
      fallback={
        <div className='space-y-6 animate-pulse'>
          <div className='h-52 bg-surface rounded-2xl' />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='h-28 bg-surface rounded-2xl' />
            <div className='h-28 bg-surface rounded-2xl' />
            <div className='h-28 bg-surface rounded-2xl' />
          </div>
        </div>
      }
    >
      <DoctorDetailContent />
    </Suspense>
  );
}
