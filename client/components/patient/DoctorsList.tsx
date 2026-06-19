'use client';

import { useGetDoctorsQuery } from '@/store/api/patientApi';
import { Calendar } from 'lucide-react';
import MagnifierIcon from '@/icons/magnifier-icon';
import MapPinIcon from '@/icons/map-pin-icon';
import UserIcon from '@/icons/user-icon';
import StarIcon from '@/icons/star-icon';
import FilterIcon from '@/icons/filter-icon';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStartConversationMutation } from '@/store/api/chatApi';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function DoctorsList() {
  const t = useTranslations();
  const PAKISTANI_CITIES = [
    t('common.allCities'),
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Gujranwala',
    'Sialkot',
    'Bahawalpur',
    'Sargodha',
    'Sukkur',
    'Larkana',
    'Sheikhupura',
    'Rahim Yar Khan',
    'Jhang',
    'Dera Ghazi Khan',
    'Gujrat',
    'Sahiwal',
    'Wah Cantonment',
    'Mardan',
    'Kasur',
    'Okara',
    'Mingora',
  ].sort();
  const { data: response, isLoading } = useGetDoctorsQuery(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const [startConversation] = useStartConversationMutation();

  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSearching]);

  const doctors = response?.data || [];

  const filteredDoctors = doctors.filter((doc: any) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinicId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.location?.address
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      doc.location?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === 'All Cities' ||
      doc.location?.city === selectedCity ||
      doc.clinicId?.address?.includes(selectedCity);

    return matchesSearch && matchesCity;
  });

  const handleMessageClick = async (doctorId: string) => {
    try {
      const res = await startConversation({ doctorId }).unwrap();
      if (res.success) {
        router.push('/dashboard/patient/chat');
      }
    } catch (err) {
      toast.error('Failed to start chat');
    }
  };

  return (
    <div className='space-y-10'>
      {/* Search and Filter Section */}
      <div className='flex flex-col md:flex-row gap-4 max-w-4xl mx-auto'>
        <div className='relative group flex-1'>
          <MagnifierIcon className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors' />
          <input
            type='text'
            placeholder={t('patient.findDoctors.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setIsSearching(true)}
            className='w-full pl-12 pr-4 h-12 rounded-lg border border-border-light bg-white text-[15px] text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none transition-colors'
          />
        </div>

        <div className='relative min-w-[200px]'>
          <MapPinIcon className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary' />
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setIsSearching(true);
            }}
            className='w-full pl-12 pr-10 h-12 appearance-none rounded-lg border border-border-light bg-white text-[15px] text-text-primary focus:border-primary focus:outline-none transition-colors cursor-pointer'
          >
            {PAKISTANI_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary'>
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </div>

        <button
          onClick={() => setIsSearching(true)}
          className='h-12 px-8 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors shrink-0'
        >
          {t('common.search')}
        </button>
      </div>

      {/* Doctors Grid */}
      <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-8 max-w-5xl mx-auto'>
        {isLoading || isSearching
          ? [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className='h-48 animate-pulse rounded-2xl border border-border-light bg-white'
              />
            ))
          : filteredDoctors.map((doctor: any) => (
              <div
                key={doctor._id}
                className='group relative bg-white rounded-2xl border border-border-light p-6 transition-all hover:border-primary/50 hover:bg-background'
              >
                <div className='flex items-start gap-5'>
                  <div className='relative'>
                    <div className='h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 overflow-hidden'>
                      {doctor.photo ? (
                        <img
                          src={
                            doctor.photo.startsWith('http')
                              ? doctor.photo
                              : `${process.env.NEXT_PUBLIC_API_URL}${doctor.photo}`
                          }
                          alt={doctor.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <UserIcon size={36} strokeWidth={1.5} />
                      )}
                    </div>
                    {doctor.isVerified && (
                      <div className='absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-lg shadow-lg border-2 border-white'>
                        <svg
                          className='w-3 h-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='3'
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h3 className='text-xl font-bold text-text-primary truncate'>
                      Dr. {doctor.name}
                    </h3>
                    <p className='text-sm font-bold text-primary mt-1'>
                      {doctor.specialization}
                    </p>

                    <div className='mt-4 flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-widest'>
                      <MapPinIcon size={14} className='text-primary' />
                      <span className='truncate'>
                        {doctor.clinicId?.name || 'Private Practice'}
                      </span>
                    </div>

                    <div className='mt-3 flex items-center gap-4'>
                      <div className='flex items-center gap-1.5 text-xs font-bold text-text-secondary'>
                        <Calendar size={14} className='text-primary' />
                        {doctor.appointmentsCount || 0} Consults
                      </div>
                      <div className='flex items-center gap-1.5 text-xs font-bold text-primary'>
                        <StarIcon size={14} color='currentColor' />
                        {doctor.rating || '4.8'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-8 pt-6 border-t border-border-light flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] font-bold text-text-secondary uppercase tracking-widest'>
                      {t('doctor.profile.consultationFee')}
                    </span>
                    <span className='text-sm font-extrabold text-text-primary'>
                      {Math.round(
                        doctor.consultationFee || 1500,
                      ).toLocaleString()}{' '}
                      {t('common.pkr')}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleMessageClick(doctor._id)}
                      className='p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all'
                      title={t('patient.findDoctors.sendMessage')}
                    >
                      <MessageSquare size={18} />
                    </button>
                    <Link
                      href={`/dashboard/patient/book-appointment?doctorId=${doctor._id}&clinicId=${doctor.clinicId?._id || ''}`}
                      className='px-6 py-3 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover transition-all'
                    >
                      {t('patient.findDoctors.bookAppointment')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className='text-center py-24 bg-background/50 rounded-2xl border border-dashed border-border-light'>
          <div className='h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
            <MagnifierIcon className='h-10 w-10 text-primary' />
          </div>
          <p className='text-2xl font-bold text-text-primary'>
            {t('patient.findDoctors.noDoctors')}
          </p>
          <p className='text-text-secondary mt-2 font-medium'>
            {t('patient.findDoctors.adjustSearch')}
          </p>
        </div>
      )}
    </div>
  );
}
