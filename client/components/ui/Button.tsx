/**
 * CareNexus — Button component
 * Design system: Blue Sky palette (#2563EB primary, #EFF4FB canvas)
 * No logic changes — purely visual tokens updated.
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  /* base */
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans font-semibold text-sm leading-none',
    'rounded-[10px] transition-all duration-150 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-primary/30 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        /* Solid blue — primary CTA */
        default: [
          'bg-primary text-white',
          'shadow-[0_2px_8px_rgba(105,133,255,0.28)]',
          'hover:bg-primary-hover hover:shadow-[0_4px_14px_rgba(105,133,255,0.36)] hover:-translate-y-px',
          'active:translate-y-0 active:opacity-90',
        ].join(' '),

        /* Sky-blue gradient — secondary / chart-style CTA */
        sky: [
          'bg-gradient-to-r from-sky to-sky-light text-[#1E3A5F]',
          'shadow-[0_2px_8px_rgba(106,191,243,0.28)]',
          'hover:brightness-105 hover:-translate-y-px',
          'active:translate-y-0',
        ].join(' '),

        /* Outlined — low emphasis */
        outline: [
          'border border-border bg-white text-text-primary',
          'hover:border-primary/50 hover:text-primary hover:bg-primary-muted',
        ].join(' '),

        /* Ghost — navigation / icon-adjacent */
        ghost: [
          'bg-transparent text-text-secondary',
          'hover:bg-primary-muted hover:text-primary',
        ].join(' '),

        /* Subtle — tinted background */
        subtle: [
          'bg-primary-muted text-primary',
          'hover:bg-primary-light hover:text-primary',
        ].join(' '),

        /* Danger */
        danger: [
          'bg-danger/90 text-white',
          'shadow-[0_2px_8px_rgba(248,113,113,0.28)]',
          'hover:bg-danger hover:shadow-[0_4px_14px_rgba(248,113,113,0.36)] hover:-translate-y-px',
          'active:translate-y-0',
        ].join(' '),

        /* Secondary — dark-navy */
        secondary: ['bg-ink text-white', 'hover:bg-ink-soft'].join(' '),

        /* Plain text link */
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto rounded-none shadow-none',
      },
      size: {
        xs: 'h-7  px-3   text-xs  rounded-[8px]',
        sm: 'h-9  px-4   text-xs',
        default: 'h-10 px-5   text-sm',
        lg: 'h-11 px-6   text-[0.9375rem]',
        xl: 'h-13 px-8   text-base',
        icon: 'h-10 w-10   rounded-[10px]',
        'icon-sm': 'h-8 w-8   rounded-[8px]',
        'icon-lg': 'h-12 w-12 rounded-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
