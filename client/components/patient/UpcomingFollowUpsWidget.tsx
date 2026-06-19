import Link from 'next/link';
import { format } from 'date-fns';
import { Building2, ChevronRight, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function UpcomingFollowUpsWidget({
  followUps,
}: {
  followUps: any[];
}) {
  if (!followUps || followUps.length === 0) return null;

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-[15px]'>Upcoming Follow-ups</CardTitle>
        <Link
          href='/dashboard/patient/records'
          className='flex items-center gap-1 text-sm font-semibold text-primary hover:underline hover:underline-offset-4'
        >
          View all
          <ChevronRight className='h-4 w-4' />
        </Link>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {followUps.map((followUp: any, index: number) => (
            <div
              key={followUp._id || index}
              className='rounded-xl bg-gray-50 p-4 hover:bg-gray-100 transition-all'
            >
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold text-text-primary truncate'>
                    {followUp.diagnosis}
                  </p>
                  <p className='text-xs text-text-secondary mt-0.5'>
                    Dr.{' '}
                    {followUp.doctorId?.doctorProfile?.fullName ||
                      followUp.doctorId?.name ||
                      'Doctor'}
                    {followUp.clinicId ? ` · ${followUp.clinicId.name}` : ''}
                  </p>
                </div>
                <span className='shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary'>
                  {format(new Date(followUp.followUpDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
