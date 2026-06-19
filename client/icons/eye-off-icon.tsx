import { forwardRef, useImperativeHandle, useCallback } from 'react';
import type { AnimatedIconHandle, AnimatedIconProps } from './types';
import { motion, useAnimate } from 'motion/react';

const EyeOffIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = 'currentColor', strokeWidth = 2, className = '' },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        '.eye-slash',
        { pathLength: 1, opacity: 1 },
        { duration: 0.3, ease: 'easeInOut' },
      );
    }, [animate]);

    const stop = useCallback(async () => {
      animate(
        '.eye-slash',
        { pathLength: 0, opacity: 0 },
        { duration: 0.3, ease: 'easeInOut' },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`cursor-pointer ${className}`}
        onHoverStart={start}
        onHoverEnd={stop}
      >
        <path stroke='none' d='M0 0h24v24H0z' fill='none' />

        {/* Eye shape */}
        <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6' />

        {/* Pupil */}
        <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />

        {/* Slash */}
        <motion.line
          x1='3'
          y1='3'
          x2='21'
          y2='21'
          className='eye-slash'
          initial={{ pathLength: 1, opacity: 1 }}
        />
      </motion.svg>
    );
  },
);

EyeOffIcon.displayName = 'EyeOffIcon';
export default EyeOffIcon;
