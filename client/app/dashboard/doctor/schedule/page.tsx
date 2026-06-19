'use client';

import { useState, useEffect } from 'react';
import {
  useGetScheduleQuery,
  useUpdateScheduleMutation,
} from '@/store/api/doctorApi';
import { toast } from 'react-hot-toast';
import { Save, Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTranslations } from 'next-intl';

const DAYS = [
  { key: 'monday' },
  { key: 'tuesday' },
  { key: 'wednesday' },
  { key: 'thursday' },
  { key: 'friday' },
  { key: 'saturday' },
  { key: 'sunday' },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function SchedulePage() {
  const t = useTranslations();
  const { data, isLoading } = useGetScheduleQuery(undefined);
  const [updateSchedule, { isLoading: saving }] = useUpdateScheduleMutation();
  const [localSchedule, setLocalSchedule] = useState<Record<string, string[]>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  useEffect(() => {
    if (data?.data?.schedule) {
      setLocalSchedule(data.data.schedule);
    }
  }, [data]);

  const toggleSlot = (day: string, slot: string) => {
    setLocalSchedule((prev) => {
      const daySlots = prev[day] || [];
      const isSelected = daySlots.includes(slot);

      return {
        ...prev,
        [day]: isSelected
          ? daySlots.filter((s) => s !== slot)
          : [...daySlots, slot],
      };
    });
  };

  const handleSave = async () => {
    toast.promise(updateSchedule({ schedule: localSchedule }).unwrap(), {
      loading: t('common.loading'),
      success: t('toast.scheduleSaved'),
      error: t('common.error'),
    });
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <Skeleton className='h-10 w-48 mb-2' />
          <Skeleton className='h-6 w-96' />
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6'>
          <Skeleton className='h-96 w-full' />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100'>
            {t('nav.schedule')}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2 text-lg'>
            {t('doctor.manageAvailability')}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className='flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 shadow-lg'
        >
          {saving ? (
            <>
              <Loader className='h-5 w-5 animate-spin' />
              {t('common.loading')}
            </>
          ) : (
            <>
              <Save className='h-5 w-5' />
              {t('doctor.saveSchedule')}
            </>
          )}
        </button>
      </div>

      <div className='rounded-2xl border border-primary/10 overflow-x-auto lens-card'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 pt-6 pb-4'>
          <div>
            <h3 className='text-xl font-black text-text-primary'>
              Weekly Availability
            </h3>
            <p className='text-sm text-text-secondary mt-1'>
              Select the hours when patients can book appointments with you.
            </p>
          </div>

          <div className='px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10'>
            <span className='text-xs font-semibold text-primary'>
              Doctor Schedule
            </span>
          </div>
        </div>

        <div className='min-w-[800px] px-4 pb-4'>
          {/* Days Header */}
          <div className='grid grid-cols-8 gap-[1px] bg-primary/10 rounded-t-2xl overflow-hidden'>
            <div className='p-4 bg-[#f4f9fe] text-sm font-bold uppercase tracking-wider text-primary'>
              {t('doctor.timeLabel')}
            </div>

            {DAYS.map((day) => (
              <div key={day.key} className='p-4 text-center bg-[#f4f9fe]'>
                <span className='text-sm font-bold text-primary'>
                  {t(`schedule.${day.key}` as any)}
                </span>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className='grid grid-cols-8 gap-[1px] bg-primary/10'
            >
              {/* Time Label */}
              <div className='p-3 bg-white text-sm font-semibold text-slate-600'>
                {slot}
              </div>

              {DAYS.map((day) => {
                const isSelected = localSchedule[day.key]?.includes(slot);

                return (
                  <button
                    key={`${day.key}-${slot}`}
                    onClick={() => toggleSlot(day.key, slot)}
                    className={`p-3 min-h-[48px] flex items-center justify-center transition-all duration-200 relative cursor-pointer
                ${
                  isSelected
                    ? 'bg-primary text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                    : 'bg-white hover:bg-[#eef7ff]'
                }
              `}
                  >
                    {isSelected && (
                      <div className='h-2.5 w-2.5 rounded-full bg-white' />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
