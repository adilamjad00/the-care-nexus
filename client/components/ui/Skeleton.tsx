/**
 * CareNexus — Skeleton / loading-state components
 * Design system: Blue Sky palette.
 * Uses soft blue-tinted pulse colour instead of grey.
 */
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/* Base skeleton block */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[10px] bg-[rgba(37,99,235,0.07)]',
        className,
      )}
      {...props}
    />
  );
}

/* ── Stat/KPI card skeleton ─────────────────────────────────────────────── */
export function CardSkeleton() {
  return (
    <div className='bg-white rounded-[18px] border border-[rgba(37,99,235,0.10)] p-5 shadow-[0_2px_12px_rgba(37,99,235,0.06)]'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex-1 space-y-2.5'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-8 w-14' />
          <Skeleton className='h-3 w-28' />
        </div>
        <Skeleton className='h-12 w-12 rounded-[12px]' />
      </div>
    </div>
  );
}

/* ── Table skeleton ─────────────────────────────────────────────────────── */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className='bg-white rounded-[18px] border border-[rgba(37,99,235,0.10)] overflow-hidden shadow-[0_2px_12px_rgba(37,99,235,0.06)]'>
      {/* header */}
      <div className='p-5 border-b border-[rgba(37,99,235,0.07)]'>
        <Skeleton className='h-5 w-40' />
      </div>
      {/* rows */}
      <div className='divide-y divide-[rgba(37,99,235,0.06)]'>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className='p-5 flex items-center gap-4'>
            <Skeleton className='h-11 w-11 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-48' />
            </div>
            <Skeleton className='h-8 w-20 rounded-[8px]' />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Full dashboard skeleton ────────────────────────────────────────────── */
export function DashboardSkeleton() {
  return (
    <div className='space-y-8 animate-pulse'>
      {/* page header */}
      <div className='space-y-2'>
        <Skeleton className='h-8 w-44' />
        <Skeleton className='h-5 w-72' />
      </div>
      {/* stat cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {/* content area */}
      <TableSkeleton rows={5} />
    </div>
  );
}

/* ── Avatar skeleton ────────────────────────────────────────────────────── */
export function AvatarSkeleton({ size = 10 }: { size?: number }) {
  return (
    <Skeleton
      className='rounded-full shrink-0'
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
}

/* ── List item skeleton (appointment, patient row) ──────────────────────── */
export function ListItemSkeleton() {
  return (
    <div className='flex items-center gap-4 p-4 rounded-[14px] bg-white border border-[rgba(37,99,235,0.07)]'>
      <Skeleton className='h-11 w-11 rounded-full' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-3 w-52' />
      </div>
      <Skeleton className='h-7 w-16 rounded-full' />
    </div>
  );
}
