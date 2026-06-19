'use client';

import { MessageSquare, Trash2 } from 'lucide-react';
import { format, isToday, isThisWeek } from 'date-fns';
import { useDeleteConversationMutation } from '@/store/api/chatApi';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

type Props = {
  conversations: any[];
  activeConversationId: string | null;
  onSelect: (conversationId: string, otherParty: any) => void;
  isLoading: boolean;
  currentUserId?: string;
};

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  isLoading,
  currentUserId,
}: Props) {
  const t = useTranslations();
  const [deleteConversation] = useDeleteConversationMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isThisWeek(date)) return format(date, 'EEE');
    return format(date, 'MMM d');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteConversation(pendingDeleteId).unwrap();
      toast.success('Conversation deleted');
      setPendingDeleteId(null);
    } catch (err) {
      toast.error('Failed to delete conversation');
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??'
    );
  };

  // An unread conversation is one where unreadCount > 0 AND it's not the active one
  const isUnread = (c: any) => {
    if (activeConversationId === c._id) return false;
    return (c.unreadCount ?? 0) > 0;
  };

  return (
    <div
      className={`w-full md:w-72 shrink-0 border-r border-black/5 flex flex-col h-full ${activeConversationId ? 'hidden md:flex' : 'flex'}`}
    >
      {/* Header */}
      <div className=' px-4 py-4 border-b border-black/5 flex items-center justify-between'>
        <h2 className='text-md font-semibold font-heading text-text-primary'>
          Messages
        </h2>
      </div>

      {/* Conversation list */}
      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='p-3 space-y-2'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='h-16 animate-pulse rounded-lg bg-black/6'
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center px-4'>
            <MessageSquare
              size={36}
              className='text-text-muted'
              strokeWidth={1.5}
            />
            <p className='text-xs font-semibold text-text-primary mt-2'>
              {t('chat.noConversations')}
            </p>
            <p className='text-[10px] text-text-muted mt-1'>
              {t('chat.startChat')}
            </p>
          </div>
        ) : (
          conversations.map((c) => {
            const unread = isUnread(c);
            return (
              <div
                key={c._id}
                onClick={() => onSelect(c._id, c.otherParty)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group relative
                  ${
                    activeConversationId === c._id
                      ? 'bg-primary/5 border-r-2 border-r-primary'
                      : unread
                        ? 'bg-primary/3 hover:bg-primary/6'
                        : 'hover:bg-black/5 :bg-white/5'
                  }`}
              >
                <div className='relative'>
                  <div className='w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold overflow-hidden'>
                    {c.otherParty.photo ? (
                      <img
                        src={c.otherParty.photo}
                        alt={c.otherParty.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      getInitials(c.otherParty.name)
                    )}
                  </div>
                  {/* Unread dot indicator */}
                  {unread && (
                    <span className='absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <span
                      className={`text-sm font-heading truncate ${unread ? 'font-black text-text-primary ' : 'font-semibold text-text-primary '}`}
                    >
                      {c.otherParty.name}
                    </span>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-[10px] shrink-0 ${unread ? 'font-bold text-primary font-heading' : 'text-text-muted '}`}
                      >
                        {formatTime(c.lastMessageAt)}
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, c._id)}
                        className='opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all'
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className='flex items-center justify-between mt-0.5'>
                    <p
                      className={`text-xs truncate max-w-35 ${
                        unread
                          ? 'font-bold text-text-primary '
                          : 'text-text-muted '
                      }`}
                    >
                      {c.lastMessage || 'No messages yet'}
                    </p>
                    {unread && (
                      <span className='ml-2 min-w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 px-1'>
                        {c.unreadCount > 9 ? '9+' : c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmationModal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        title={t('modal.confirmDelete')}
        message={t('modal.cannotUndo')}
      />
    </div>
  );
}
