'use client';

import {
  useGetConnectionRequestsQuery,
  useHandleConnectionRequestMutation,
} from '@/store/api/patientApi';
import { UserPlus, Check, X, Building2, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConnectionRequestsWidget() {
  const { data, isLoading } = useGetConnectionRequestsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  });
  const [handleRequest, { isLoading: isProcessing }] =
    useHandleConnectionRequestMutation();

  const requests = data?.data || [];

  const onHandle = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await handleRequest({ id, status }).unwrap();
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error('Failed to handle request');
    }
  };

  if (isLoading)
    return (
      <div className='h-32 bg-white animate-pulse rounded-2xl border border-border-light' />
    );
  if (requests.length === 0) return null;

  return (
    <div className='bg-white rounded-2xl border border-border-light p-8 animate-in fade-in slide-in-from-top-4 duration-700'>
      <div className='flex items-center gap-4 mb-8'>
        <div className='h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
          <UserPlus className='h-6 w-6 text-primary' />
        </div>
        <div>
          <h2 className='text-xl font-black text-text-primary tracking-tight'>
            Professional Connections
          </h2>
          <p className='text-xs font-bold text-text-primary uppercase tracking-widest mt-1'>
            Pending Requests
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {requests.map((request: any) => (
          <div
            key={request._id}
            className='group relative p-6 bg-background rounded-2xl border border-border-light/50 hover:border-primary/30 transition-all overflow-hidden'
          >
            <div className='flex items-start justify-between'>
              <div className='flex gap-4'>
                <div className='h-14 w-14 bg-white rounded-2xl flex items-center justify-center border border-border-light group-hover:bg-primary transition-colors'>
                  {request.fromRole === 'doctor' ? (
                    <Stethoscope className='h-7 w-7 text-primary group-hover:text-white' />
                  ) : (
                    <Building2 className='h-7 w-7 text-primary group-hover:text-white' />
                  )}
                </div>
                <div>
                  <h3 className='font-black text-text-primary text-lg'>
                    {request.fromName}
                  </h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg'>
                      {request.fromRole}
                    </span>
                    <span className='text-[10px] font-bold text-text-primary uppercase tracking-widest'>
                      Wants Access
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex gap-2'>
                <button
                  disabled={isProcessing}
                  onClick={() => onHandle(request._id, 'approved')}
                  className='h-10 w-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors'
                  title='Approve'
                >
                  <Check className='h-5 w-5' />
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => onHandle(request._id, 'rejected')}
                  className='h-10 w-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors'
                  title='Reject'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
            </div>

            <p className='mt-4 text-xs font-medium text-text-primary leading-relaxed border-t border-border-light pt-4'>
              Allows this {request.fromRole} to view your medical history,
              reports, and prescriptions for better care.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
