/**
 * CareNexus — Card component
 * Design system: Blue Sky palette.
 * White card on #EFF4FB canvas, subtle blue border, soft shadow.
 * No logic changes — purely visual tokens updated.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

/* ── Root card ──────────────────────────────────────────────────────────── */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('lens-card', className)} {...props} />
));
Card.displayName = 'Card';

/* ── Card Header ────────────────────────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1 p-5 pb-3', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/* ── Card Title ─────────────────────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-sans text-[14.5px] font-bold leading-snug tracking-tight text-text-primary',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/* ── Card Description ───────────────────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs text-text-secondary mt-0.5 leading-relaxed',
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/* ── Card Content ───────────────────────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-2', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/* ── Card Footer ────────────────────────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-3 p-5 pt-0',
      'border-t border-[rgba(37,99,235,0.07)] mt-3',
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

/* ── Stat Card (KPI / dashboard summary) ───────────────────────────────── */
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  iconVariant?: 'blue' | 'sky' | 'green' | 'amber';
}

const iconVariantMap: Record<string, string> = {
  blue: 'bg-[rgba(105,133,255,0.12)] text-primary',
  sky: 'bg-[rgba(106,191,243,0.15)] text-[#1E88BF]',
  green: 'bg-[rgba(154,224,114,0.18)] text-[#3A7A1A]',
  amber: 'bg-[rgba(238,226,96,0.20)]  text-[#8A6E10]',
};

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      trend,
      trendUp = true,
      sub,
      icon,
      iconVariant = 'blue',
      className,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn('stat-card', className)} {...props}>
      {/* Text side */}
      <div className='flex-1 min-w-0'>
        <p className='text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-1.5'>
          {title}
        </p>
        <p className='text-[1.75rem] font-bold text-text-primary leading-none'>
          {value}
        </p>
        {trend && (
          <p
            className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${trendUp ? 'text-[#3A7A1A]' : 'text-danger'}`}
          >
            <span>{trendUp ? '↑' : '↓'}</span>
            {trend}
          </p>
        )}
        {sub && <p className='text-[11.5px] text-text-muted mt-1.5'>{sub}</p>}
      </div>

      {/* Icon side */}
      {icon && (
        <div
          className={cn(
            'w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0',
            iconVariantMap[iconVariant],
          )}
        >
          {icon}
        </div>
      )}
    </div>
  ),
);
StatCard.displayName = 'StatCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
};
