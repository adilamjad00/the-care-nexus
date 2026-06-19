'use client';

interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function Hamburger({ isOpen, onClick, className = '' }: HamburgerProps) {
  return (
    <button
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className={`relative h-10 w-10 flex cursor-pointer items-center justify-center rounded-lg transition-all duration-300 ${className}`}
      aria-label='Toggle menu'
    >
      <div className='relative w-5 h-4 flex flex-col justify-between cursor-pointer'>
        <span
          className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 origin-left ${
            isOpen ? 'rotate-45 translate-x-1 -translate-y-0.5' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${
            isOpen ? 'opacity-0 translate-x-2' : 'opacity-100'
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 origin-left ${
            isOpen ? '-rotate-45 translate-x-1 translate-y-0.5' : ''
          }`}
        />
      </div>
    </button>
  );
}
