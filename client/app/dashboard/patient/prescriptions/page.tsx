'use client';

import { useState } from 'react';
import { useGetRecordsQuery } from '@/store/api/patientApi';
import Link from 'next/link';
import {
  Pill,
  Calendar,
  User,
  Search,
  ChevronRight,
  FileText,
} from 'lucide-react';

export default function PrescriptionsPage() {
  const { data, isLoading } = useGetRecordsQuery(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const records = data?.data || [];

  // Flatten all medicines from all records into a single list
  const prescriptions = records.flatMap((record: any) =>
    (record.medicines || []).map((med: any) => ({
      ...med,
      recordId: record._id,
      diagnosis: record.diagnosis,
      doctorName: record.doctorId?.name,
      date: record.createdAt,
      validUntil: record.validUntil,
    })),
  );

  const filteredPrescriptions = prescriptions.filter(
    (p: any) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-text-primary tracking-tight'>
          Active Prescriptions
        </h1>
        <p className='text-text-secondary'>
          View and manage all medications prescribed during your consultations
        </p>
      </div>

      {/* Search Bar */}
      <div className='relative group'>
        <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors' />
        <input
          type='text'
          placeholder='Search prescriptions by medicine name, doctor, or diagnosis...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full h-12 rounded-lg border border-border-light bg-white pl-12 pr-4 text-text-primary placeholder:text-text-secondary transition-colors'
        />
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='h-40 animate-pulse rounded-2xl bg-surface'
            />
          ))}
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-border-light bg-background/50 p-20 text-center'>
          <div className='h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
            <Pill className='h-10 w-10 text-primary' />
          </div>
          <h3 className='text-xl font-bold text-text-primary'>
            No Prescriptions Found
          </h3>
          <p className='mt-2 text-text-secondary max-w-sm mx-auto'>
            {searchTerm
              ? "We couldn't find any medications matching your search criteria."
              : 'Once a doctor prescribes you medicine, it will appear here for easy access.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {filteredPrescriptions.map((p: any, idx: number) => {
            const isExpired =
              p.validUntil && new Date(p.validUntil) < new Date();

            return (
              <div
                key={`${p.recordId}-${idx}`}
                className='group relative flex flex-col rounded-2xl border border-border-light bg-white p-6 transition-all hover:border-primary/50 hover:bg-background overflow-hidden'
              >
                {/* Status Badge */}
                <div className='absolute top-6 right-6'>
                  {isExpired ? (
                    <span className='px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full'>
                      Expired
                    </span>
                  ) : (
                    <span className='px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full'>
                      Active
                    </span>
                  )}
                </div>

                <div className='flex items-start gap-4 mb-6'>
                  <div className='h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 transition-transform'>
                    <Pill className='h-7 w-7 text-primary' />
                  </div>
                  <div className='flex-1 min-w-0 pr-16'>
                    <h3 className='text-xl font-bold text-text-primary truncate'>
                      {p.name}
                    </h3>
                    <p className='text-sm font-semibold text-primary'>
                      {p.dosage}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div className='space-y-1'>
                    <p className='text-[10px] font-bold text-text-secondary uppercase tracking-widest'>
                      Frequency
                    </p>
                    <p className='text-sm font-semibold text-text-primary'>
                      {p.frequency}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[10px] font-bold text-text-secondary uppercase tracking-widest'>
                      Duration
                    </p>
                    <p className='text-sm font-semibold text-text-primary'>
                      {p.duration}
                    </p>
                  </div>
                </div>

                <div className='mt-auto pt-6 border-t border-border-light'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                      <User size={14} className='text-text-secondary' />
                      <span className='text-xs text-text-secondary'>
                        Dr. {p.doctorName}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Calendar size={14} className='text-text-secondary' />
                      <span className='text-xs text-text-secondary'>
                        {formatDate(p.date)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/patient/records/${p.recordId}`}
                    className='flex items-center justify-center gap-2 w-full py-3 bg-background rounded-xl text-xs font-bold text-text-secondary hover:bg-primary hover:text-white transition-all group/btn'
                  >
                    <span>View Full Record</span>
                    <ChevronRight
                      size={14}
                      className='group-hover/btn:translate-x-1 transition-transform'
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
