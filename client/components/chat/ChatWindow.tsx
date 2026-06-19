'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChatSocket } from '@/providers/ChatSocketProvider';
import {
  useGetMessagesQuery,
  useMarkReadMutation,
  useUploadFileMutation,
  useDeleteMessageMutation,
  useDeleteConversationMutation,
} from '@/store/api/chatApi';
import { format } from 'date-fns';
import {
  Paperclip,
  Send,
  Check,
  CheckCheck,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

type Props = {
  conversationId: string;
  currentUser: { id: string; role: 'doctor' | 'patient'; name: string };
  otherParty: { name: string; photo?: string; specialization?: string };
  onBack?: () => void;
};

export default function ChatWindow({
  conversationId,
  currentUser,
  otherParty,
  onBack,
}: Props) {
  const t = useTranslations();
  const normalizeUserId = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (value._id) return String(value._id);
      if (value.id) return String(value.id);
    }
    return String(value);
  };
  const currentUserId = normalizeUserId(
    (currentUser as any).id || (currentUser as any)._id,
  );
  const isOwnMessage = (msg: any): boolean => {
    const senderRole = (msg?.senderRole || '').toLowerCase();
    // Always rely on sender role for ownership in doctor/patient chat rendering.
    return !!senderRole && senderRole === currentUser.role;
  };
  const {
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    acknowledgeDelivered,
    onNewMessage,
    onTypingStatus,
    onMessageDeleted,
    onMessagesRead,
    onMessageStatusUpdated,
  } = useChatSocket();
  const { data: messagesData } = useGetMessagesQuery(conversationId);
  const [markRead] = useMarkReadMutation();
  const [uploadFile] = useUploadFileMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [deleteConversationMutation] = useDeleteConversationMutation();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesData?.data) setMessages(messagesData.data);
  }, [messagesData]);

  useEffect(() => {
    joinConversation(conversationId);
    markRead({ conversationId, viewerRole: currentUser.role });

    const unsubMessage = onNewMessage((msg: any) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev: any[]) => {
          if (prev.some((m: any) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        const isMine = isOwnMessage(msg);
        if (!isMine && msg._id) {
          acknowledgeDelivered(conversationId, msg._id);
        }

        markRead({ conversationId, viewerRole: currentUser.role });
      }
    });

    const unsubTyping = onTypingStatus(
      ({ isTyping: typing, senderId }: any) => {
        if (normalizeUserId(senderId) !== currentUserId) {
          setIsTyping(typing);
        }
      },
    );

    const unsubRead = onMessagesRead(
      ({ conversationId: incomingId, readerId }: any) => {
        if (incomingId === conversationId) {
          if (normalizeUserId(readerId) === currentUserId) {
            return;
          }

          setMessages((prev: any[]) =>
            prev.map((m: any) => {
              const senderIdStr = normalizeUserId(m.senderId);
              if (senderIdStr === currentUserId) {
                return { ...m, isRead: true, isDelivered: true };
              }
              return m;
            }),
          );
        }
      },
    );

    const unsubStatus = onMessageStatusUpdated(
      ({ messageId, conversationId: incomingId, isDelivered, isRead }: any) => {
        if (incomingId !== conversationId) return;
        setMessages((prev: any[]) =>
          prev.map((m: any) => {
            if (m._id !== messageId) return m;
            return {
              ...m,
              isDelivered:
                typeof isDelivered === 'boolean' ? isDelivered : m.isDelivered,
              isRead: typeof isRead === 'boolean' ? isRead : m.isRead,
            };
          }),
        );
      },
    );

    const unsubDeleted = onMessageDeleted(({ messageId }: any) => {
      setMessages((prev: any[]) =>
        prev.map((m: any) =>
          m._id === messageId
            ? {
                ...m,
                isDeleted: true,
                content: 'This message was deleted',
                type: 'text',
                fileUrl: undefined,
                fileName: undefined,
              }
            : m,
        ),
      );
    });

    return () => {
      leaveConversation(conversationId);
      unsubMessage?.();
      unsubTyping?.();
      unsubDeleted?.();
      unsubRead?.();
      unsubStatus?.();
    };
  }, [
    conversationId,
    currentUser.role,
    onNewMessage,
    onTypingStatus,
    onMessagesRead,
    onMessageStatusUpdated,
    onMessageDeleted,
    joinConversation,
    leaveConversation,
    acknowledgeDelivered,
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    sendTyping(conversationId, currentUserId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(conversationId, currentUserId, false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({
      conversationId,
      senderId: currentUserId,
      senderRole: currentUser.role,
      content: input.trim(),
      type: 'text',
    });
    setInput('');
    sendTyping(conversationId, currentUserId, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setIsSending(true);
    try {
      const result = await uploadFile({ conversationId, formData }).unwrap();
      sendMessage({
        conversationId,
        senderId: currentUserId,
        senderRole: currentUser.role,
        content: '',
        type: 'file',
        fileUrl: result.data.fileUrl,
        fileName: result.data.fileName,
      });
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Failed to upload file');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId).unwrap();
      // Optionally update local state immediately if socket is slow
      setMessages((prev: any[]) =>
        prev.map((m: any) =>
          m._id === messageId
            ? {
                ...m,
                isDeleted: true,
                content: 'This message was deleted',
                type: 'text',
                fileUrl: undefined,
                fileName: undefined,
              }
            : m,
        ),
      );
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete message');
    }
  };

  const handleDeleteConversation = async () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteConversation = async () => {
    try {
      await deleteConversationMutation(conversationId).unwrap();
      toast.success('Conversation deleted');
      if (onBack) onBack();
    } catch (err) {
      console.error('Delete conversation failed', err);
      toast.error('Failed to delete conversation');
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full ${!conversationId ? 'hidden md:flex' : 'flex'}`}
    >
      {/* Chat header */}
      <div className='px-4 md:px-5 py-3 border-b border-black/5 flex items-center gap-3'>
        {onBack && (
          <button
            onClick={onBack}
            className='md:hidden p-2 -ml-2 text-text-secondary hover:bg-black/5 rounded-lg transition-colors'
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className='w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0'>
          {otherParty.photo ? (
            <img
              src={otherParty.photo}
              className='w-full h-full object-cover'
            />
          ) : (
            otherParty.name?.charAt(0)
          )}
        </div>
        <div className='min-w-0 flex-1'>
          <h3 className='text-sm font-semibold text-text-primary truncate'>
            {otherParty.name}
          </h3>
          <p className='text-[11px] md:text-xs text-text-muted truncate'>
            {otherParty.specialization ||
              (currentUser.role === 'doctor' ? 'Patient' : 'Doctor')}
          </p>
        </div>
        <button
          onClick={handleDeleteConversation}
          className='p-2 text-text-secondary hover:text-red-500 hover:bg-red-50/50 :bg-red-500/10 rounded-lg transition-all'
          title='Delete Conversation'
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages area */}
      <div className='flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2'>
        {messages.map((msg) => {
          const isMine = isOwnMessage(msg);
          const displayContent =
            typeof msg.content === 'string' && msg.content.trim()
              ? msg.content
              : '';

          return (
            <div
              key={msg._id}
              className='w-full animate-in fade-in slide-in-from-bottom-2 group/msg '
            >
              <div
                className={`max-w-[60%] sm:max-w-[60%] relative ${isMine ? 'ml-auto' : 'mr-auto'} ${
                  isMine
                    ? 'px-4 py-2.5 rounded-2xl rounded-br-sm bg-primary text-white text-sm font-body'
                    : 'px-4 py-2.5 rounded-2xl rounded-bl-sm bg-surface  border border-black/5  text-sm font-body text-text-primary '
                } ${msg.isDeleted ? 'opacity-60 italic' : ''}`}
              >
                {msg.isDeleted ? (
                  <span className='flex items-center gap-1.5 opacity-70'>
                    <Trash2 size={12} />
                    This message was deleted
                  </span>
                ) : msg.type === 'file' ? (
                  <a
                    href={msg.fileUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 underline underline-offset-2'
                  >
                    <Paperclip size={14} /> {msg.fileName || 'File'}
                  </a>
                ) : (
                  displayContent
                )}
                <div
                  className={`text-[10px] mt-1 flex items-center gap-1.5 ${isMine ? 'text-white/80 justify-end' : 'text-text-secondary justify-start'}`}
                >
                  {format(new Date(msg.createdAt), 'h:mm a')}
                  {isMine &&
                    !msg.isDeleted &&
                    (msg.isRead ? (
                      <CheckCheck
                        size={13}
                        strokeWidth={3}
                        className='inline-block text-sky-300'
                      />
                    ) : msg.isDelivered ? (
                      <CheckCheck
                        size={13}
                        strokeWidth={2}
                        className='inline-block opacity-60'
                      />
                    ) : (
                      <Check
                        size={13}
                        strokeWidth={3}
                        className='inline-block opacity-60'
                      />
                    ))}
                </div>

                {isMine && !msg.isDeleted && (
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className='absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-text-secondary hover:text-red-500 opacity-0 group-hover/msg:opacity-100 transition-all rounded-lg hover:bg-black/5'
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className='flex justify-start'>
            <div className='px-4 py-2.5 rounded-2xl rounded-bl-sm bg-[#F4F3EE] border border-black/5'>
              <div className='flex gap-1 items-center h-4'>
                <span className='w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]' />
                <span className='w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]' />
                <span className='w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]' />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className='border-t border-black/5 p-4 flex items-end gap-2'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*,application/pdf'
          className='hidden'
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className='p-2 rounded-lg text-text-muted hover:bg-black/5 :bg-white/5 transition-colors shrink-0'
        >
          <Paperclip size={18} />
        </button>
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.typeMessage')}
          rows={1}
          className='flex-1 resize-none px-3.5 py-2.5 rounded-lg text-sm bg-[#F4F3EE] text-text-primary border border-border-light placeholder:text-text-muted max-h-32 overflow-y-auto'
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className='p-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0'
        >
          <Send size={18} />
        </button>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteConversation}
        title='Delete Conversation'
        message='Are you sure you want to delete this entire conversation? This action cannot be undone.'
      />
    </div>
  );
}
