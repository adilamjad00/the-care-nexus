'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setNotifications } from '@/store/slices/notificationSlice';
import {
  useMarkAsReadMutation,
  useClearAllNotificationsMutation,
} from '@/store/api/notificationApi';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
}: NotificationModalProps) {
  const t = useTranslations();
  const { notifications, unreadCount } = useSelector(
    (state: any) => state.notifications,
  );
  const dispatch = useDispatch();
  const [markAsRead] = useMarkAsReadMutation();
  const [clearAll] = useClearAllNotificationsMutation();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      const updated = notifications.map((n: any) =>
        n._id === id ? { ...n, read: true } : n,
      );
      dispatch(setNotifications(updated));
    } catch (error) {
      toast.error(t('toast.notificationMarkFailed'));
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAll().unwrap();
      dispatch(setNotifications([]));
      toast.success(t('toast.notificationsCleared'));
      onClose();
    } catch (error) {
      toast.error(t('toast.notificationsClearFailed'));
    }
  };

  const getTimeLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const modalContent = (
    <div className='fixed inset-0 z-10000 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      />

      <div className='relative w-full max-w-md bg-white rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300'>
        <div className='p-6 border-b border-black/5 flex items-center justify-between bg-primary/5'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center relative'>
              <Bell className='text-primary h-5 w-5' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white' />
              )}
            </div>
            <div>
              <h2 className='font-bold text-text-primary uppercase tracking-widest text-[10px]'>
                Notifications
              </h2>
              <p className='text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1'>
                You have {unreadCount} unread
              </p>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <button
              onClick={handleClearAll}
              className='p-2 text-text-secondary hover:text-red-500 transition-colors'
              title='Clear all'
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className='p-2 text-text-secondary hover:text-text-primary :text-white transition-colors'
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className='max-h-[60vh] overflow-y-auto p-4 space-y-3'>
          {notifications.length === 0 ? (
            <div className='py-14 flex flex-col items-center justify-center text-center'>
              <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
                <Bell className='h-5 w-5 text-primary' />
              </div>
              <p className='text-sm font-medium text-text-primary'>
                All caught up
              </p>
              <p className='text-xs text-text-secondary mt-1'>
                No new notifications
              </p>
            </div>
          ) : (
            notifications.map((notification: any) => (
              <div
                key={notification._id}
                onClick={() =>
                  !notification.read && handleMarkAsRead(notification._id)
                }
                className={`group p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  notification.read
                    ? 'bg-background/50  border-transparent opacity-80'
                    : 'bg-white  border-primary/20 border-l-4 border-l-primary'
                }`}
              >
                {!notification.read && (
                  <div className='absolute top-4 right-4 h-2 w-2 bg-primary rounded-full' />
                )}
                <div className='flex gap-4'>
                  <div
                    className={`h-10 w-10 min-w-10 rounded-lg flex items-center justify-center ${
                      notification.read ? 'bg-surface ' : 'bg-primary/10'
                    }`}
                  >
                    <CheckCircle2
                      size={18}
                      className={
                        notification.read
                          ? 'text-text-secondary'
                          : 'text-primary'
                      }
                    />
                  </div>
                  <div className='space-y-1 pr-4'>
                    <p
                      className={`text-sm font-bold transition-colors ${
                        notification.read
                          ? 'text-text-secondary '
                          : 'text-text-primary '
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className='text-xs text-text-secondary leading-relaxed font-medium'>
                      {notification.message}
                    </p>
                    <div className='flex items-center gap-1.5 pt-1 text-[10px] text-text-secondary uppercase tracking-widest font-bold'>
                      <Clock size={10} />
                      <span>{getTimeLabel(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className='p-4 bg-background/50 border-t border-black/5 text-center'>
            <p className='text-[10px] text-text-secondary font-bold uppercase tracking-widest leading-none'>
              End of notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
