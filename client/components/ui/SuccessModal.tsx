'use client';

import { Modal } from './Modal';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useEffect, useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionText = 'Continue',
  onAction,
}: SuccessModalProps) {
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='' size='sm'>
      <div className='relative py-4'>
        {/* Animated Background Glow */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 blur-[80px] rounded-full animate-pulse' />

        <div className='relative flex flex-col items-center text-center space-y-6'>
          {/* Success Icon with Animation */}
          <div className='relative'>
            <div
              className={`absolute -inset-4 bg-primary/10 rounded-full blur-xl transition-all duration-1000 ${showSparkles ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`}
            />
            <div className='h-24 w-24 bg-primary rounded-2xl flex items-center justify-center text-white rotate-12 hover:rotate-0 transition-transform duration-500 animate-in zoom-in spin-in-12'>
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>

            {showSparkles && (
              <div className='absolute -top-4 -right-4 animate-bounce'>
                <Sparkles className='text-primary h-8 w-8 fill-primary/20' />
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <h2 className='text-3xl font-black text-text-primary tracking-tight leading-tight'>
              {title}
            </h2>
            <p className='text-base font-medium text-text-secondary max-w-[280px] mx-auto leading-relaxed'>
              {message}
            </p>
          </div>

          <div className='w-full pt-4'>
            <Button
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
              className='w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all'
            >
              {actionText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
