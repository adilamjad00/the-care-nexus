/**
 * CareNexus — Badge component
 * Design system: Blue Sky palette.
 * Pill-shaped status labels with semantic colour variants.
 * No logic changes — purely visual tokens updated.
 */
import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'sky'
  | 'royal'
  | 'success'
  | 'warning'
  | 'danger'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'secondary'
  | 'muted'
  /* legacy aliases kept for back-compat */
  | 'teal'
  | 'blue'
  | 'yellow'
  | 'red'
  | 'purple'
  | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean; /* prepend a coloured dot */
  size?: 'sm' | 'md';
}

/* Variant → Tailwind class map */
const variantClasses: Record<BadgeVariant, string> = {
  /* ── Semantic ────────────────────────────────── */
  default:
    'bg-[rgba(37,99,235,0.08)]   text-primary          border-[rgba(37,99,235,0.18)]',
  primary:
    'bg-[rgba(37,99,235,0.08)]   text-primary          border-[rgba(37,99,235,0.18)]',
  sky: 'bg-[rgba(106,191,243,0.14)] text-[#1E88BF]        border-[rgba(106,191,243,0.30)]',
  royal:
    'bg-[rgba(105,133,255,0.12)] text-[#3D52C5]        border-[rgba(105,133,255,0.25)]',
  success:
    'bg-[rgba(154,224,114,0.16)] text-[#3A7A1A]        border-[rgba(154,224,114,0.38)]',
  warning:
    'bg-[rgba(238,226,96,0.18)]  text-[#7A6610]        border-[rgba(238,226,96,0.40)]',
  danger:
    'bg-[rgba(248,113,113,0.12)] text-[#B91C1C]        border-[rgba(248,113,113,0.25)]',
  secondary:
    'bg-surface                  text-text-secondary   border-border-light',
  muted:
    'bg-surface                  text-text-muted       border-border-light',

  /* ── Appointment status ──────────────────────── */
  pending:
    'bg-[rgba(238,226,96,0.18)]  text-[#7A6610]        border-[rgba(238,226,96,0.38)]',
  confirmed:
    'bg-[rgba(37,99,235,0.08)]   text-primary          border-[rgba(37,99,235,0.18)]',
  completed:
    'bg-[rgba(154,224,114,0.16)] text-[#3A7A1A]        border-[rgba(154,224,114,0.38)]',
  cancelled:
    'bg-[rgba(248,113,113,0.12)] text-[#B91C1C]        border-[rgba(248,113,113,0.25)]',

  /* ── Legacy aliases ──────────────────────────── */
  teal: 'bg-[rgba(37,99,235,0.08)]   text-primary   border-[rgba(37,99,235,0.18)]',
  blue: 'bg-[rgba(37,99,235,0.08)]   text-primary   border-[rgba(37,99,235,0.18)]',
  yellow:
    'bg-[rgba(238,226,96,0.18)]  text-[#7A6610] border-[rgba(238,226,96,0.38)]',
  red: 'bg-[rgba(248,113,113,0.12)] text-[#B91C1C] border-[rgba(248,113,113,0.25)]',
  purple:
    'bg-[rgba(105,133,255,0.12)] text-[#3D52C5] border-[rgba(105,133,255,0.25)]',
  slate: 'bg-surface                  text-text-secondary border-border-light',
};

/* Dot colour for each variant */
const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary',
  primary: 'bg-primary',
  sky: 'bg-sky',
  royal: 'bg-royal',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  secondary: 'bg-text-muted',
  muted: 'bg-text-muted',
  pending: 'bg-warning',
  confirmed: 'bg-primary',
  completed: 'bg-success',
  cancelled: 'bg-danger',
  teal: 'bg-primary',
  blue: 'bg-primary',
  yellow: 'bg-warning',
  red: 'bg-danger',
  purple: 'bg-royal',
  slate: 'bg-text-muted',
};

export const Badge = ({
  children,
  variant = 'default',
  className = '',
  dot = false,
  size = 'md',
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-full border font-semibold uppercase tracking-wider',
        'whitespace-nowrap transition-colors',
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px]'
          : 'px-2.5 py-[3px] text-[10.5px]',
        variantClasses[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotClasses[variant],
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
