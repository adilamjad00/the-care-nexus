'use client';

import { useState } from 'react';
import {
  useLazySearchPatientsQuery,
  useGetPatientsQuery,
} from '@/store/api/clinicApi';
import { useRouter } from 'next/navigation';
import {
  Search as SearchIcon,
  UserCircle2,
  RefreshCcw,
  User,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { useTranslations } from 'next-intl';

export default function PatientSearch() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;
  const {
    data: allData,
    isLoading: allLoading,
    refetch: refetchAll,
  } = useGetPatientsQuery({ page, limit });
  const [trigger, { data: searchData, isLoading: isSearching }] =
    useLazySearchPatientsQuery();
  const router = useRouter();

  const getPatientAvatar = (patient: any) => {
    const raw =
      patient.profile?.profilePhoto ||
      patient.patientProfile?.profilePhoto ||
      patient.photo ||
      '';
    if (!raw) return '';
    if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
    const base = (
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    ).replace(/\/api\/?$/, '');
    return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`;
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setIsSearched(false);
      return;
    }
    try {
      setPage(1);
      setIsSearched(true);
      // Pass false to preferCacheValue to force a fresh fetch
      const result = await trigger({ q: query, page: 1, limit }, false);
      if (result.error) {
        toast.error(t('common.error') || 'Search failed');
      }
    } catch (error: any) {
      toast.error(t('common.error') || 'Search failed');
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsSearched(false);
    setPage(1);
    refetchAll();
  };

  const results = isSearched
    ? searchData?.data?.patients || []
    : allData?.data?.patients || [];
  const pagination = isSearched
    ? searchData?.data?.pagination
    : allData?.data?.pagination;
  const isLoading = isSearched ? isSearching : allLoading;

  const handlePageChange = async (nextPage: number) => {
    setPage(nextPage);
    if (isSearched && searchQuery.trim()) {
      try {
        await trigger({
          q: searchQuery.trim(),
          page: nextPage,
          limit,
        }).unwrap();
      } catch {
        toast.error('Failed to load that page.');
      }
    }
  };

  return (
    <div className='space-y-6 animate-in '>
      <form
        onSubmit={handleSearch}
        className='rounded-2xl border border-border-light lens-card'
      >
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1 relative'>
            <SearchIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-primary' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('clinic.patientSearch.searchPlaceholder')}
              className='w-full h-12 pl-12 pr-4 border border-border-light rounded-lg text-text-primary placeholder:text-text-secondary transition-colors'
            />
            {searchQuery && (
              <button
                type='button'
                onClick={handleClear}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline'
              >
                {t('common.clear')}
              </button>
            )}
          </div>
          <Button
            type='submit'
            disabled={isLoading}
            className='h-full py-3.5 px-8'
          >
            {isSearching ? (
              <RefreshCcw className='h-5 w-5 animate-spin' />
            ) : (
              t('common.search')
            )}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='h-48 bg-background animate-pulse rounded-2xl border border-border-light'
            />
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 '>
            {results.map((patient: any) => (
              <div
                key={patient._id}
                className='bg-white p-8 rounded-2xl border border-border-light hover:bg-background transition-all group lens-card'
              >
                <div className='flex flex-col items-center text-center'>
                  <div className='h-20 w-20 rounded-2xl overflow-hidden mb-4 transition-all border border-black/5 flex items-center justify-center bg-primary/10'>
                    {getPatientAvatar(patient) ? (
                      <img
                        src={getPatientAvatar(patient)}
                        alt={patient.name}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/carenexus.jpeg';
                        }}
                      />
                    ) : (
                      <UserCircle2 className='h-10 w-10 text-primary' />
                    )}
                  </div>
                  <h3 className='text-xl font-bold text-text-primary mb-1'>
                    {patient.name}
                  </h3>
                  <p className='text-sm text-text-primary mb-6 truncate w-full'>
                    {patient.email}
                  </p>

                  <div className='w-full grid grid-cols-2 gap-4 text-left p-4 bg-primary/5 border border-border-light rounded-2xl mb-6'>
                    <div>
                      <p className='text-[10px] font-black text-text-primary uppercase tracking-widest'>
                        {t('form.gender')}
                      </p>
                      <p className='text-sm font-bold text-text-primary capitalize'>
                        {patient.profile?.gender ||
                          patient.patientProfile?.gender ||
                          patient.gender ||
                          t('clinic.profile.notProvided')}
                      </p>
                    </div>
                    <div>
                      <p className='text-[10px] font-black text-text-primary uppercase tracking-widest'>
                        {t('clinic.patientSearch.totalVisits')}
                      </p>
                      <p className='text-xl font-black text-text-primary leading-none'>
                        {patient.totalVisits || 0}
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/clinic_admin/patients/${patient._id}`,
                        )
                      }
                      className='w-full py-3.5 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-all font-black text-[10px] uppercase tracking-widest'
                    >
                      {t('clinic.patientSearch.viewProfile')}
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/clinic_admin/appointments?patientId=${patient._id}`,
                        )
                      }
                      className='w-full py-3.5 bg-white text-primary border border-primary rounded-2xl hover:bg-primary/5 transition-all font-black text-[10px] uppercase tracking-widest'
                    >
                      {t('clinic.appointments.title')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination?.pages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-xs font-semibold text-text-secondary'>
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handlePageChange(Math.max(page - 1, 1))}
                  disabled={page <= 1}
                  className='px-3 py-1.5 rounded-lg border border-border-light text-sm font-semibold disabled:opacity-50'
                >
                  {t('common.previous')}
                </button>
                <button
                  onClick={() =>
                    handlePageChange(Math.min(page + 1, pagination.pages))
                  }
                  disabled={page >= pagination.pages}
                  className='px-3 py-1.5 rounded-lg border border-border-light text-sm font-semibold disabled:opacity-50'
                >
                  {t('common.next')}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-gray-50 border border-black/6'>
          <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
            <User className='h-5 w-5 text-primary' />
          </div>
          <p className='text-sm font-medium text-text-primary'>
            {t('clinic.patientSearch.noResults')}
          </p>
          <p className='text-xs text-text-secondary mt-1'>
            {t('clinic.patientSearch.adjustSearch')}
          </p>
        </div>
      )}
    </div>
  );
}
