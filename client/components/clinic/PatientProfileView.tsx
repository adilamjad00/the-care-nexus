'use client';

import { useGetPatientProfileQuery } from '@/store/api/clinicApi';
import { format } from 'date-fns';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Pill,
  Activity,
  Printer,
  ArrowLeft,
  Download,
  ExternalLink,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PatientProfileView({
  patientId,
  hideDownload = false,
  hideActions = true,
  additionalActions,
}: {
  patientId: string;
  hideDownload?: boolean;
  hideActions?: boolean;
  additionalActions?: React.ReactNode;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'appointments' | 'records'>(
    'appointments',
  );

  const isDoctor = pathname.includes('/dashboard/doctor');
  const recordBaseUrl = isDoctor
    ? '/dashboard/doctor/records'
    : '/dashboard/clinic_admin/records';
  const appointmentBaseUrl = isDoctor
    ? '/dashboard/doctor/appointments'
    : '/dashboard/clinic_admin/appointments';

  const { data, isLoading, error } = useGetPatientProfileQuery(patientId);

  if (isLoading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='h-64 bg-surface rounded-2xl' />
        <div className='h-96 bg-surface rounded-2xl' />
      </div>
    );
  }

  const patientData = data?.data;
  if (error || !patientData) {
    return (
      <div className='text-center py-20 bg-white rounded-2xl border border-border-light'>
        <Activity className='mx-auto h-12 w-12 text-text-secondary opacity-50 mb-4' />
        <p className='text-text-secondary font-bold'>
          Failed to load patient profile.
        </p>
        <button
          onClick={() => router.back()}
          className='mt-4 text-primary font-bold hover:underline'
        >
          Go Back
        </button>
      </div>
    );
  }

  const { patient, appointments, prescriptions, medicalRecords, stats } =
    patientData;

  const getAvatarSrc = () => {
    const raw =
      patient?.profile?.profilePhoto ||
      patient?.patientProfile?.profilePhoto ||
      patient?.photo ||
      '';
    if (!raw) return '';
    if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
    const base = (
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    ).replace(/\/api\/?$/, '');
    return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`;
  };

  const patientAppointmentsLink = `/dashboard/clinic_admin/appointments?patientId=${patient._id}`;

  return (
    <div className='space-y-6'>
      {/* Header / Action Bar */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group font-bold  tracking-widest text-[10px]'
        >
          <ArrowLeft
            size={16}
            className='group-hover:-translate-x-1 transition-transform'
          />
          {t('common.back')}
        </button>
        <div className='flex w-full flex-wrap items-stretch justify-start gap-2 sm:w-auto sm:justify-end sm:gap-3'>
          {additionalActions}
          {!hideDownload && (
            <button
              onClick={() => window.print()}
              className='inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-surface text-primary rounded-full font-black text-[9px] sm:text-[10px] tracking-widest border border-primary/20 hover:bg-primary/10 transition-all active:scale-95 whitespace-nowrap'
            >
              <Printer size={16} />
              {t('common.download')}
            </button>
          )}
        </div>
      </div>

      {/* Patient Hero Card */}
      <div className='bg-white rounded-2xl border border-border-light overflow-hidden group'>
        <div className='bg-white p-5 md:p-6 border-b border-border-light'>
          <div className='flex flex-col md:flex-row items-center gap-5 md:gap-6'>
            <div className='relative'>
              <div className='h-24 w-24 md:h-28 md:w-28 bg-white rounded-full flex items-center justify-center text-primary ring-6 ring-primary/5 overflow-hidden'>
                {getAvatarSrc() ? (
                  <img
                    src={getAvatarSrc()}
                    alt={patient.name}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='h-full w-full flex items-center justify-center bg-primary/10 text-primary font-black text-3xl'>
                    {patient.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className='flex-1 text-center md:text-left'>
              <h1 className='text-2xl md:text-3xl font-bold  tracking-tight mb-2 '>
                {patient.name}
              </h1>
              <div className='flex flex-wrap justify-center md:justify-start gap-2.5 mt-3'>
                <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl border border-border-light'>
                  <Mail size={14} className='text-primary' />
                  <span className='text-xs font-bold text-text-secondary'>
                    {patient.email || 'N/A'}
                  </span>
                </div>
                <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl border border-border-light'>
                  <Phone size={14} className='text-primary' />
                  <span className='text-xs font-bold text-text-secondary'>
                    {patient.phone || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='bg-primary text-white p-4 rounded-2xl text-center min-w-32'>
                <p className='text-[10px] font-bold tracking-wider opacity-80 mb-1'>
                  {t('patient.profile.totalVisits')}
                </p>
                <p className='text-2xl font-black leading-none'>
                  {stats.totalVisits}
                </p>
              </div>
            </div>
          </div>

          {/* Removed extra buttons as requested */}
        </div>

        <div className='p-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-1'>
            <p className='text-[10px] font-bold text-text-muted tracking-wider'>
              {t('patient.profile.dateOfBirth')}
            </p>
            <p className='text-sm font-bold text-text-primary'>
              {patient.profile?.dob
                ? format(new Date(patient.profile.dob), 'MMMM dd, yyyy')
                : 'N/A'}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-[10px] font-bold text-text-muted tracking-wider'>
              {t('patient.profile.gender')}
            </p>
            <p className='text-sm font-bold text-text-primary '>
              {patient.profile?.gender || 'N/A'}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-[10px] font-bold text-text-muted tracking-wider'>
              {t('patient.profile.bloodGroup')}
            </p>
            <p className='text-sm font-bold text-red-500'>
              {patient.profile?.bloodGroup || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* History Tabs */}
      <div className='bg-white rounded-2xl border border-border-light overflow-hidden flex flex-col h-full min-h-125'>
        <div className='px-6 pt-6 border-b border-border-light print:hidden'>
          <div className='flex gap-6'>
            {(['appointments', 'records'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-bold tracking-wider transition-all relative ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t(`patient.profile.${tab}`)}
                {activeTab === tab && (
                  <div className='absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full' />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className='p-6 flex-1'>
          {/* Appointments List */}
          {activeTab === 'appointments' && (
            <div className='space-y-4'>
              {(appointments || []).length === 0 ? (
                <div className='text-center py-20 bg-white rounded-2xl border-2 border-dashed border-border-light'>
                  <Calendar className='mx-auto h-10 w-10 text-text-muted opacity-30 mb-4' />
                  <p className='text-sm font-bold text-text-muted italic'>
                    {t('patient.profile.noHistory')}
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-4'>
                  {appointments.map((app: any) => (
                    <div
                      key={app._id}
                      className='group bg-white p-4 md:p-5 rounded-2xl border border-border-light hover:border-primary/30 transition-all'
                    >
                      <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-4'>
                          <div className='h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-primary'>
                            <Clock size={24} />
                          </div>
                          <div>
                            <p className='text-xs font-black text-text-primary  tracking-tight'>
                              {format(
                                new Date(app.dateTime),
                                'MMM dd, yyyy • h:mm a',
                              )}
                            </p>
                            <p className='text-xs font-bold text-text-secondary mt-1'>
                              Dr. {app.doctorId?.name} • {app.type}
                            </p>
                          </div>
                        </div>
                        <div className='flex flex-col items-end gap-3'>
                          <span className='px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider bg-white border border-border-light text-text-primary'>
                            {t(`appointment.status.${app.status}`)}
                          </span>
                          <Link
                            href={`${appointmentBaseUrl}/${app._id}`}
                            className='rounded-lg bg-white px-3.5 py-2 text-[10px] font-black  tracking-widest text-primary border border-primary/15 hover:bg-primary/5 transition-all'
                          >
                            {t('clinic.appointments.viewAppointment')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Prescriptions & Medical Records Unified */}
          {activeTab === 'records' && (
            <div className='space-y-4'>
              {(() => {
                const combinedRecords = [
                  ...(prescriptions || []).map((p: any) => ({
                    ...p,
                    type: 'prescription',
                  })),
                  ...(medicalRecords || []).map((m: any) => ({
                    ...m,
                    type: 'record',
                  })),
                ].sort(
                  (a, b) =>
                    new Date(b.createdAt || b.dateTime).getTime() -
                    new Date(a.createdAt || a.dateTime).getTime(),
                );

                if (combinedRecords.length === 0) {
                  return (
                    <div className='text-center py-20 bg-white rounded-2xl border-2 border-dashed border-border-light'>
                      <Activity className='mx-auto h-10 w-10 text-text-primary opacity-30 mb-4' />
                      <p className='text-sm font-bold text-text-primary italic'>
                        {t('patient.profile.noHistory')}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className='grid grid-cols-1 gap-4'>
                    {combinedRecords.map((record: any) => (
                      <div
                        key={record._id}
                        className='bg-white p-4 md:p-5 rounded-2xl border border-border-light group hover:border-primary/20 transition-all'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-4'>
                            <div className='h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-primary'>
                              {record.type === 'prescription' ? (
                                <FileText size={24} />
                              ) : (
                                <Activity size={24} />
                              )}
                            </div>
                            <div>
                              <p className='text-xs font-black text-text-primary  tracking-tight'>
                                {format(
                                  new Date(
                                    record.visitDate ||
                                      record.dateTime ||
                                      record.createdAt,
                                  ),
                                  'MMMM dd, yyyy',
                                )}
                              </p>
                              <h4 className='text-sm font-bold text-text-primary mt-0.5'>
                                {record.diagnosis || record.chiefComplaint}
                              </h4>
                              <p className='text-[10px] font-bold text-primary tracking-widest mt-1'>
                                {record.type === 'prescription'
                                  ? t('nav.prescriptions')
                                  : record.diagnosis || 'Medical Record'}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center gap-3'>
                            <div className='flex items-center gap-2 print:hidden'>
                              <Link
                                href={`${recordBaseUrl}/${record._id}?type=${record.type === 'prescription' ? 'prescription' : 'record'}`}
                                className='rounded-2xl bg-white px-4 py-2 text-[10px] font-bold tracking-widest text-primary hover:bg-primary/5 border border-primary/15 transition-all active:scale-95'
                              >
                                <ExternalLink
                                  size={16}
                                  className='inline-block mr-2'
                                />
                                {t('common.view')}
                              </Link>
                              {record.type === 'prescription' &&
                                !hideDownload && (
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `${recordBaseUrl}/${record._id}?print=true&type=prescription`,
                                        '_blank',
                                      )
                                    }
                                    className='rounded-2xl bg-white px-4 py-2 text-[10px] font-bold tracking-widest text-primary hover:bg-primary hover:text-white transition-all active:scale-95'
                                  >
                                    <Download
                                      size={16}
                                      className='inline-block mr-2'
                                    />
                                    {t('common.download')}
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
