'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  useGetConversationsQuery,
  useStartConversationMutation,
} from '@/store/api/chatApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageSquare } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useChatSocket } from '@/providers/ChatSocketProvider';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

function ChatContent() {
  const t = useTranslations();
  const { data, isLoading, refetch } = useGetConversationsQuery({
    viewerRole: 'doctor',
  });
  const [startConversation] = useStartConversationMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [activeOtherParty, setActiveOtherParty] = useState<any>(null);
  const searchParams = useSearchParams();
  const { onConversationUpdated, onNewMessage } = useChatSocket();

  useEffect(() => {
    const refreshConversations = () => {
      refetch();
    };

    const unsubUpdated = onConversationUpdated?.(refreshConversations);
    const unsubNewMessage = onNewMessage?.(refreshConversations);
    return () => {
      unsubUpdated?.();
      unsubNewMessage?.();
    };
  }, [onConversationUpdated, onNewMessage, refetch]);

  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    const patientId = searchParams.get('patientId');
    const patientName = searchParams.get('patientName') || 'Patient';

    if (!data?.data || (!conversationId && !patientId)) {
      return;
    }

    if (conversationId) {
      const byConversationId = data.data.find(
        (c: any) => c._id === conversationId,
      );
      if (byConversationId) {
        handleSelect(byConversationId._id, byConversationId.otherParty);
        return;
      }
    }

    if (patientId) {
      const existing = data.data.find(
        (c: any) => c.otherParty?._id === patientId,
      );
      if (existing) {
        handleSelect(existing._id, existing.otherParty);
      } else {
        startConversation({ patientId })
          .unwrap()
          .then((res) => {
            if (res?.success) {
              handleSelect(res.data.conversationId, {
                _id: patientId,
                name: patientName,
                role: 'patient',
              });
              refetch();
            }
          })
          .catch(() => {
            toast.error(t('toast.startChatFailed'));
          });
      }
    }
  }, [searchParams, data]);

  const handleSelect = (conversationId: string, otherParty: any) => {
    setActiveConversationId(conversationId);
    setActiveOtherParty(otherParty);
  };

  return (
    <div className='flex h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border-[2px] border-white lens-card'>
      <ConversationList
        conversations={data?.data || []}
        activeConversationId={activeConversationId}
        onSelect={handleSelect}
        isLoading={isLoading}
      />
      <div className='flex-1'>
        {activeConversationId && activeOtherParty && user ? (
          <ChatWindow
            conversationId={activeConversationId}
            currentUser={{
              id: (user as any)._id || (user as any).id,
              role: 'doctor',
              name: (user as any).name || 'Doctor',
            }}
            otherParty={activeOtherParty}
            onBack={() => setActiveConversationId(null)}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-center p-8'>
            <div className='w-16 h-16 rounded-2xl bg-black/3 dark:bg-white/3 flex items-center justify-center mb-4'>
              <MessageSquare
                size={32}
                className='text-text-muted dark:text-[#52525b]'
                strokeWidth={1.5}
              />
            </div>
            <h3 className='text-sm font-semibold font-heading text-gray-900'>
              {t('chat.noConversations')}
            </h3>
            <p className='text-sm font-body text-text-muted dark:text-[#71717a] mt-1.5 max-w-50'>
              {t('chat.startChat')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoctorChatPage() {
  return (
    <Suspense
      fallback={
        <div className='p-8 text-center text-text-secondary'>
          Loading chat...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
