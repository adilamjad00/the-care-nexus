'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  useCreateAppointmentMutation,
  useSearchPatientsQuery,
  useGetScheduleQuery,
  useGetAppointmentsQuery,
  useGetPatientByIdQuery,
} from '@/store/api/doctorApi';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  Loader,
  Search,
  Check,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NewAppointmentPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdFromQuery = searchParams.get('patientId') || '';
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentDate: '',
    slotTime: '',
    duration: '15',
    type: 'consultation',
    reason: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: scheduleData } = useGetScheduleQuery(undefined);
  const { data: appointmentsData } = useGetAppointmentsQuery(
    { date: formData.appointmentDate, limit: 200 },
    { skip: !formData.appointmentDate },
  );
  const { data: patientData } = useGetPatientByIdQuery(patientIdFromQuery, {
    skip: !patientIdFromQuery,
  });

  useEffect(() => {
    const patient = patientData?.data?.patient;
    if (!patient || !patientIdFromQuery) return;

    setFormData((prev) =>
      prev.patientId === patient._id
        ? prev
        : { ...prev, patientId: patient._id },
    );
    setSearch(
      patient.email ? `${patient.name} (${patient.email})` : patient.name || '',
    );
    setIsOpen(false);
  }, [patientData, patientIdFromQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: searchData, isFetching: isSearching } = useSearchPatientsQuery(
    debouncedSearch,
    {
      skip: debouncedSearch.length < 2,
    },
  );

  const foundPatients = Array.isArray(searchData?.data)
    ? searchData.data
    : Array.isArray(searchData)
      ? searchData
      : Array.isArray(searchData?.data?.patients)
        ? searchData.data.patients
        : [];
  const [createAppointment, { isLoading: creating }] =
    useCreateAppointmentMutation();

  const selectedDate = formData.appointmentDate
    ? new Date(`${formData.appointmentDate}T00:00:00`)
    : null;
  const selectedDayKey = selectedDate
    ? selectedDate
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase()
    : '';

  const configuredSlots = selectedDayKey
    ? scheduleData?.data?.schedule?.[selectedDayKey] || []
    : [];

  const bookedSlots = new Set(
    (appointmentsData?.data?.appointments || [])
      .filter((appointment: any) =>
        ['pending', 'confirmed', 'reserved', 'in-progress'].includes(
          appointment.status,
        ),
      )
      .map((appointment: any) => {
        const dt = new Date(appointment.dateTime);
        const h = String(dt.getHours()).padStart(2, '0');
        const m = String(dt.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
      }),
  );

  const availableSlots = configuredSlots
    .slice()
    .sort((a: string, b: string) => a.localeCompare(b))
    .filter((slot: string) => {
      if (bookedSlots.has(slot)) return false;

      if (!formData.appointmentDate) return true;
      const slotDateTime = new Date(`${formData.appointmentDate}T${slot}:00`);
      return slotDateTime.getTime() > Date.now();
    });

  const resolveImageUrl = (photo?: string | null) => {
    if (!photo) return '';
    const trimmed = String(photo).trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    const baseApi = process.env.NEXT_PUBLIC_API_URL || '';
    const baseOrigin = baseApi
      ? baseApi.replace(/\/api\/?$/, '')
      : typeof window !== 'undefined'
        ? window.location.origin
        : '';
    if (!baseOrigin) return '';

    const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    try {
      return new URL(normalizedPath, baseOrigin).toString();
    } catch {
      return '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = t('form.required');
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = t('form.required');
    }

    if (!formData.slotTime) {
      newErrors.slotTime = t('form.required');
    } else {
      const selected = new Date(
        `${formData.appointmentDate}T${formData.slotTime}:00`,
      );
      if (selected <= new Date()) {
        newErrors.slotTime = t('doctor.appointments.newForm.futureOnly');
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = t('form.required');
    } else if (formData.reason.trim().length < 5) {
      newErrors.reason = t('doctor.appointments.newForm.reasonLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      if (errors.patientId) {
        toast.error(t('doctor.appointments.newForm.selectPatientFirst'));
      } else {
        toast.error(t('common.error'));
      }
      return;
    }

    const toastId = toast.loading(t('doctor.appointments.newForm.creating'));

    try {
      await createAppointment({
        patientId: formData.patientId,
        dateTime: `${formData.appointmentDate}T${formData.slotTime}:00`,
        duration: 15,
        type: formData.type,
        reason: formData.reason,
        notes: formData.notes,
      }).unwrap();

      toast.success(t('toast.appointmentBooked'), { id: toastId });
      router.push('/dashboard/doctor/appointments');
    } catch (error: any) {
      toast.error(error?.data?.message || t('common.error'), { id: toastId });
    }
  };

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/dashboard/doctor/appointments'
          className='h-10 w-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-surface/80 transition-colors'
        >
          <ArrowLeft className='h-5 w-5 text-gray-600 dark:text-gray-400' />
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
            {t('doctor.appointments.newForm.title')}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            {t('doctor.appointments.newForm.subtitle')}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6'
      >
        {/* Patient Selection */}
        <div className='relative'>
          <label className='block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            <User className='inline h-4 w-4 mr-2' />
            {t('doctor.appointments.patient')}{' '}
            <span className='text-red-500'>*</span>
          </label>

          <div className='relative group/search'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10' />
            <input
              type='text'
              placeholder={t('doctor.appointments.newForm.searchPlaceholder')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
                if (errors.patientId) setErrors({ ...errors, patientId: '' });
              }}
              onFocus={() => setIsOpen(true)}
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none bg-white text-black transition-all ${
                errors.patientId
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary'
              }`}
            />
            {isSearching && (
              <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                <Loader className='h-4 w-4 animate-spin text-primary' />
              </div>
            )}

            {/* Search Results Dropdown */}
            {isOpen && search.trim().length >= 2 && (
              <div className='absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-200 divide-y divide-gray-100 dark:divide-gray-700'>
                {foundPatients.length === 0 ? (
                  <div className='p-8 text-center'>
                    <User className='h-8 w-8 mx-auto text-gray-300 mb-2' />
                    <p className='text-sm font-medium text-gray-500'>
                      {isSearching
                        ? t('common.loading')
                        : t('doctor.patients.noPatients')}
                    </p>
                    {!isSearching && (
                      <Link
                        href='/dashboard/doctor/patients/new'
                        className='text-primary text-xs font-bold mt-2 inline-block hover:underline'
                      >
                        {t('doctor.patients.addNewPatient')}
                      </Link>
                    )}
                  </div>
                ) : (
                  foundPatients.map((patient: any) => (
                    <button
                      key={patient._id}
                      type='button'
                      onClick={() => {
                        setFormData({ ...formData, patientId: patient._id });
                        setSearch(`${patient.name} (${patient.email})`);
                        setIsOpen(false);
                      }}
                      className='w-full text-left p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center gap-3'
                    >
                      <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20'>
                        {patient.photo ? (
                          (() => {
                            const imageUrl = resolveImageUrl(patient.photo);
                            return imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={patient.name}
                                className='h-full w-full object-cover rounded-full'
                                onError={(e) => {
                                  (
                                    e.currentTarget as HTMLImageElement
                                  ).style.display = 'none';
                                }}
                              />
                            ) : (
                              <User className='h-5 w-5' />
                            );
                          })()
                        ) : (
                          <User className='h-5 w-5' />
                        )}
                      </div>
                      <div className='min-w-0'>
                        <p className='font-bold text-gray-900 dark:text-white truncate'>
                          {patient.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                          {patient.email}
                        </p>
                      </div>
                      {patient._id === formData.patientId && (
                        <Check className='h-4 w-4 text-primary ml-auto' />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {errors.patientId && (
            <p className='text-red-500 text-sm mt-1'>{errors.patientId}</p>
          )}

          {/* Quick Selected Patient Info */}
          {formData.patientId && !isOpen && (
            <div className='mt-3 p-3 bg-surface dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-lg flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center'>
                  <Check className='h-4 w-4' />
                </div>
                <span className='text-sm font-bold text-gray-900 dark:text-gray-100'>
                  Patient Selected
                </span>
              </div>
              <button
                type='button'
                onClick={() => {
                  setFormData({ ...formData, patientId: '' });
                  setSearch('');
                }}
                className='text-xs font-bold text-red-500 hover:underline px-2 py-1'
              >
                {t('common.clearAll')}
              </button>
            </div>
          )}
        </div>

        {/* Date and Schedule Slot */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              <Calendar className='inline h-4 w-4 mr-2' />
              {t('common.date')} <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              value={formData.appointmentDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  appointmentDate: e.target.value,
                  slotTime: '',
                });
                if (errors.appointmentDate || errors.slotTime) {
                  setErrors({ ...errors, appointmentDate: '', slotTime: '' });
                }
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white text-black ${
                errors.appointmentDate
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-primary'
              }`}
            />
            {errors.appointmentDate && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.appointmentDate}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
              <Clock className='inline h-4 w-4 mr-2' />
              {t('form.time')} <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.slotTime}
              onChange={(e) => {
                setFormData({ ...formData, slotTime: e.target.value });
                if (errors.slotTime) setErrors({ ...errors, slotTime: '' });
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${errors.slotTime ? 'border-red-500 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-primary'}`}
              disabled={!formData.appointmentDate}
            >
              <option value=''>
                {t('doctor.appointments.newForm.selectSlot')}
              </option>
              {availableSlots.map((slot: string) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.slotTime && (
              <p className='text-red-500 text-sm mt-1'>{errors.slotTime}</p>
            )}
            {formData.appointmentDate && availableSlots.length === 0 && (
              <p className='text-amber-600 text-sm mt-1'>
                {t('doctor.appointments.newForm.noSlots')}
              </p>
            )}
          </div>
        </div>

        {/* fixed duration note removed per UX request */}

        {/* Appointment Type */}
        <div>
          <label className='block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            {t('common.type')}
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className='w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          >
            <option value='consultation'>
              {t('doctor.appointments.newForm.types.consultation')}
            </option>
            <option value='follow-up'>
              {t('doctor.appointments.newForm.types.followUp')}
            </option>
            <option value='routine'>
              {t('doctor.appointments.newForm.types.routine')}
            </option>
            <option value='emergency'>
              {t('doctor.appointments.newForm.types.emergency')}
            </option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className='block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            {t('doctor.appointments.newForm.reason')}{' '}
            <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={formData.reason}
            onChange={(e) => {
              setFormData({ ...formData, reason: e.target.value });
              if (errors.reason) setErrors({ ...errors, reason: '' });
            }}
            placeholder={t('doctor.appointments.newForm.reasonPlaceholder')}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white text-black placeholder:text-gray-500 dark:text-gray-500 ${
              errors.reason
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 dark:border-gray-700 focus:border-primary'
            }`}
          />
          {errors.reason && (
            <p className='text-red-500 text-sm mt-1'>{errors.reason}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className='block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            <FileText className='inline h-4 w-4 mr-2' />
            {t('doctor.notes')} ({t('common.optional')})
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder={t('doctor.appointments.newForm.notesPlaceholder')}
            rows={4}
            className='w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 resize-none'
          />
        </div>

        {/* Actions */}
        <div className='flex gap-3 pt-4'>
          <Link
            href='/dashboard/doctor/appointments'
            className='flex-1 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-semibold text-gray-900 dark:text-gray-100 hover:bg-surface transition-all text-center'
          >
            {t('common.cancel')}
          </Link>
          <button
            type='submit'
            disabled={creating}
            className='flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {creating ? (
              <span className='flex items-center justify-center gap-2'>
                <Loader className='h-5 w-5 animate-spin' />
                {t('doctor.appointments.newForm.creating')}
              </span>
            ) : (
              t('doctor.appointments.newForm.submit')
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
