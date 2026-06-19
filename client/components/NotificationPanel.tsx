'use client';

import { useSelector, useDispatch } from 'react-redux';
import { AlertCircle, Info } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import FilledBellIcon from '@/icons/filled-bell-icon';
import CheckedIcon from '@/icons/checked-icon';
import TrashIcon from '@/icons/trash-icon';
import {
  markAsRead as localMarkAsRead,
  markAllAsRead as localMarkAllAsRead,
  clearNotifications as localClearNotifications,
  removeNotification as localRemoveNotification,
} from '@/store/slices/notificationSlice';
import {
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} from '@/store/api/notificationApi';
import { Modal } from './ui/Modal';
import { toast } from 'react-hot-toast';
import { useFormatter, useLocale, useTranslations } from 'next-intl';

export default function NotificationPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ur';
  const format = useFormatter();
  const router = useRouter();
  const pathname = usePathname();
  const { notifications } = useSelector((state: any) => state.notifications);
  const dispatch = useDispatch();

  const [markAsReadApi] = useMarkAsReadMutation();
  const [markAllReadApi] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [clearAllApi] = useClearAllNotificationsMutation();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckedIcon className='h-4 w-4 text-primary' />;
      case 'error':
        return <AlertCircle size={16} className='text-red-500' />;
      case 'warning':
        return <AlertCircle size={16} className='text-[#B45309]' />;
      case 'appointment_status':
        return <CheckedIcon className='h-4 w-4 text-primary' />;
      case 'appointment_booked':
        return <Info size={16} className='text-primary' />;
      case 'appointment_cancelled_by_patient':
        return <AlertCircle size={16} className='text-[#B45309]' />;
      case 'appointment_reminder':
        return <Info size={16} className='text-primary' />;
      case 'doctor_appointment_reminder':
        return <Info size={16} className='text-primary' />;
      case 'follow_up_reminder':
        return <Info size={16} className='text-primary' />;
      case 'new_prescription':
        return <CheckedIcon className='h-4 w-4 text-primary' />;
      default:
        return <Info size={16} className='text-primary' />;
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      return format.relativeTime(new Date(date), new Date());
    } catch (e) {
      return t('common.justNow');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsReadApi(id).unwrap();
      dispatch(localMarkAsRead(id));
    } catch (error) {
      // Error handled by RTK query or ignored for background sync
      toast.error(t('toast.notificationMarkFailed'));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadApi().unwrap();
      dispatch(localMarkAllAsRead());
    } catch (error) {
      // Keep silent for bulk action to avoid noisy UX.
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
      dispatch(localRemoveNotification(id));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllApi().unwrap();
      dispatch(localClearNotifications());
    } catch (error) {
      // Keep silent for bulk action to avoid noisy UX.
    }
  };

  const activePortal = pathname?.split('/')[2];

  const getPortalFromNotification = (notification: any) => {
    if (notification?.portal && notification.portal !== 'general')
      return notification.portal;
    const actionUrl = notification?.actionUrl || notification?.link || '';
    const match = String(actionUrl).match(
      /\/dashboard\/(patient|doctor|clinic_admin)(\/|$)/,
    );
    return match ? match[1] : notification?.portal || 'general';
  };

  const visibleNotifications = notifications.filter((notification: any) => {
    const portal = getPortalFromNotification(notification);
    return portal === activePortal || portal === 'general';
  });

  const localizeNotification = (title: string, message: string) => {
    if (locale !== 'ur') return { title, message };

    const titleMap: Record<string, string> = {
      'New Appointment Request': 'نئی اپائنٹمنٹ درخواست',
      'Appointment Confirmed': 'اپائنٹمنٹ تصدیق ہو گئی',
      'Appointment Cancelled': 'اپائنٹمنٹ منسوخ ہو گئی',
      'Appointment Started': 'اپائنٹمنٹ شروع ہو گئی',
      'Appointment Completed': 'اپائنٹمنٹ مکمل ہو گئی',
      'New Prescription Received': 'نیا نسخہ موصول ہوا',
      'Revenue Earned': 'آمدنی حاصل ہوئی',
      'Platform Revenue Earned': 'کلینک آمدنی حاصل ہوئی',
      'New Booking at Clinic': 'کلینک میں نئی بکنگ',
      'New Connection Request': 'نئی کنکشن درخواست',
      'Clinic Connection Request': 'کلینک کنکشن درخواست',
      'Connection Request Approved': 'کنکشن درخواست منظور ہو گئی',
      'Connection Request Rejected': 'کنکشن درخواست مسترد ہو گئی',
      'Follow-up Reminder': 'فالو اپ یاد دہانی',
      'Appointment Reminder (24h)': 'اپائنٹمنٹ یاد دہانی (24 گھنٹے)',
      'Appointment Reminder (1h)': 'اپائنٹمنٹ یاد دہانی (1 گھنٹہ)',
      Success: 'کامیابی',
      Cancelled: 'منسوخ',
    };

    let localizedMessage = message
      .replace('has booked a consultation for', 'نے مشاورت بک کی ہے برائے')
      .replace('has been confirmed.', 'تصدیق ہو گئی ہے۔')
      .replace('has been cancelled.', 'منسوخ کر دی گئی ہے۔')
      .replace(
        'has started your consultation.',
        'نے آپ کی مشاورت شروع کر دی ہے۔',
      )
      .replace('is now complete.', 'اب مکمل ہو چکی ہے۔')
      .replace('has issued a new prescription', 'نے نیا نسخہ جاری کیا ہے')
      .replace(
        'has approved your connection request.',
        'نے آپ کی کنکشن درخواست منظور کر لی ہے۔',
      )
      .replace(
        'has rejected your connection request.',
        'نے آپ کی کنکشن درخواست مسترد کر دی ہے۔',
      )
      .replace('A new appointment', 'ایک نئی اپائنٹمنٹ')
      .replace('tomorrow at', 'کل')
      .replace('Your appointment with', 'آپ کی اپائنٹمنٹ')
      .replace('No notifications', 'کوئی نوٹیفکیشن نہیں')
      .replace('Just now', 'ابھی ابھی');

    return {
      title: titleMap[title] || title,
      message: localizedMessage,
    };
  };

  const resolveNotificationText = (n: any) => {
    const translateKey = (key?: string, params?: Record<string, any>) => {
      if (!key) return '';
      const normalized = String(key).startsWith('notifications.')
        ? String(key)
        : `notifications.${key}`;
      try {
        return t(normalized as any, params || {});
      } catch {
        return '';
      }
    };

    const keyedTitle = translateKey(n?.titleKey, n?.bodyParams);
    const keyedMessage = translateKey(n?.bodyKey, n?.bodyParams);

    if (keyedTitle || keyedMessage) {
      return {
        title: keyedTitle || n?.title || '',
        message: keyedMessage || n?.message || '',
      };
    }

    return localizeNotification(n?.title || '', n?.message || '');
  };

  const handleOpen = async (n: any) => {
    const id = n._id || n.id;
    await handleMarkRead(id);

    if (n?.actionUrl) {
      onClose();
      router.push(n.actionUrl);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('topbar.notifications')}
      size='md'
      footer={
        visibleNotifications.length > 0 && (
          <div className='flex items-center justify-between w-full'>
            <button
              onClick={handleClearAll}
              className='text-[10px] font-black text-red-500 hover:text-red-600 transition-colors uppercase tracking-[0.2em]'
            >
              {t('common.clearAll').toUpperCase()}
            </button>
            <button
              onClick={handleMarkAllRead}
              className='flex items-center gap-2 group'
            >
              <span className='text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:opacity-70 transition-all'>
                {t('topbar.markAllRead').toUpperCase()}
              </span>
            </button>
          </div>
        )
      }
    >
      <div className='flex flex-col -mt-4'>
        <div className='space-y-3'>
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((n: any) => (
              <div
                key={n._id || n.id}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${
                  !n.read
                    ? 'bg-white  border-primary/20'
                    : 'bg-transparent border-black/5  grayscale-[0.5] opacity-70 hover:opacity-100 hover:grayscale-0'
                }`}
                onClick={() => handleOpen(n)}
              >
                <div className='flex gap-4'>
                  <div
                    className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center transition-all ${!n.read ? 'bg-primary/10 text-primary' : 'bg-surface  text-text-secondary'}`}
                  >
                    {getIcon(n.type)}
                  </div>
                  <div className='flex-1 min-w-0 pr-12'>
                    {(() => {
                      const localized = resolveNotificationText(n);
                      return (
                        <>
                          <div className='flex items-start justify-between gap-2 mb-1'>
                            <h4
                              className={`text-sm font-bold truncate ${!n.read ? 'text-text-primary ' : 'text-text-secondary '}`}
                            >
                              {localized.title}
                            </h4>
                          </div>
                          <p className='text-[11px] font-medium text-text-secondary leading-normal line-clamp-2'>
                            {localized.message}
                          </p>
                          <div className='flex items-center gap-3 mt-3'>
                            <span className='text-[9px] font-black text-text-secondary uppercase tracking-widest'>
                              {getTimeAgo(n.createdAt)}
                            </span>
                            {!n.read && (
                              <div className='h-1.5 w-1.5 rounded-full bg-primary animate-pulse' />
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(e, n._id || n.id)}
                  className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex items-center justify-center`}
                >
                  <TrashIcon className='h-4 w-4' />
                </button>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-20 px-6 text-center'>
              <div className='h-20 w-20 bg-background rounded-2xl flex items-center justify-center mb-6 border border-dashed border-border-light'>
                <FilledBellIcon className='h-6 w-6' />
              </div>
              <h4 className='text-xl font-black text-text-primary uppercase tracking-tight'>
                {t('topbar.noNotifications').toUpperCase()}
              </h4>
              <p className='text-sm font-bold text-text-secondary mt-2 max-w-50 leading-relaxed'>
                {t('topbar.noNotificationsDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
