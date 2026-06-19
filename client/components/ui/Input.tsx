/**
 * CareNexus — Input component
 * Design system: Blue Sky palette. White bg, sky-blue focus ring, navy text.
 * No logic changes — purely visual tokens updated.
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Inline error message shown below the input */
  error?: string;
  /** Label rendered above the input */
  label?: React.ReactNode;
  /** Helper hint rendered below the input (when no error) */
  hint?: React.ReactNode;
  /** Icon or adornment to render on the left inside the input wrapper */
  leftAdornment?: React.ReactNode;
  /** Icon or adornment to render on the right inside the input wrapper */
  rightAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      label,
      hint,
      id,
      leftAdornment,
      rightAdornment,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const hasLeft = Boolean(leftAdornment);
    const hasRight = Boolean(rightAdornment);

    return (
      <div className='flex flex-col gap-1.5 w-full'>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className='text-[12.5px] font-semibold text-text-primary tracking-wide'
          >
            {label}
          </label>
        )}

        {/* Input wrapper — allows positioning adornments */}
        <div className='relative flex items-center'>
          {/* Left adornment */}
          {hasLeft && (
            <span className='absolute left-3 text-text-muted flex items-center pointer-events-none'>
              {leftAdornment}
            </span>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              /* base */
              'flex h-11 w-full rounded-[10px]',
              'border-[1.5px] border-border-light bg-white',
              'px-3.5 py-2',
              'font-sans text-[0.875rem] text-text-primary',
              'placeholder:text-text-muted',
              /* transitions */
              'transition-colors duration-150',
              /* focus */
              'focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10',
              /* disabled */
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface',
              /* file input */
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              /* error */
              error &&
                'border-danger/60 focus:border-danger focus:ring-danger/10',
              /* adornment padding */
              hasLeft && 'pl-9',
              hasRight && 'pr-9',
              className,
            )}
            ref={ref}
            {...props}
          />

          {/* Right adornment */}
          {hasRight && (
            <span className='absolute right-3 text-text-muted flex items-center'>
              {rightAdornment}
            </span>
          )}
        </div>

        {/* Error / hint */}
        {error ? (
          <span className='text-[11.5px] font-medium text-danger/90'>
            {error}
          </span>
        ) : hint ? (
          <span className='text-[11.5px] text-text-muted'>{hint}</span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
