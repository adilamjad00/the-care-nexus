'use client';

import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const variantColors = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-[#B45309] hover:bg-[#B45309]',
    info: 'bg-primary hover:bg-primary-hover',
  };

  const variantIconColors = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-surface-cream text-[#B45309]',
    info: 'bg-surface text-primary',
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200'>
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className='absolute top-4 right-4 p-2 rounded-lg hover:bg-surface transition-colors disabled:opacity-50'
        >
          <X className='h-5 w-5 text-text-secondary' />
        </button>

        {/* Icon */}
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${variantIconColors[variant]}`}
        >
          <AlertTriangle className='h-6 w-6' />
        </div>

        {/* Title */}
        <h3 className='text-xl font-bold text-black mb-2'>{title}</h3>

        {/* Message */}
        <p className='text-text-secondary mb-6'>{message}</p>

        {/* Actions */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='flex-1 px-4 py-2.5 rounded-lg font-semibold border-2 border-border-light text-text-primary hover:bg-surface transition-all disabled:opacity-50'
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition-all disabled:opacity-50 ${variantColors[variant]}`}
          >
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <div className='h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Loading...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
