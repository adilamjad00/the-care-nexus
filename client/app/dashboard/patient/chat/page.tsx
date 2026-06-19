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
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useChatSocket } from '@/providers/ChatSocketProvider';
import { useTranslations } from 'next-intl';

function ChatContent() {
  const t = useTranslations();
  const { data, isLoading, refetch } = useGetConversationsQuery({
    viewerRole: 'patient',
  });
  const [startConversation] = useStartConversationMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [activeOtherParty, setActiveOtherParty] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
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
    const doctorId = searchParams.get('doctorId');
    if (doctorId && data?.data) {
      const existing = data.data.find(
        (c: any) => c.otherParty._id === doctorId,
      );
      if (existing) {
        handleSelect(existing._id, existing.otherParty);
      } else {
        // Start new
        const doctorName = searchParams.get('doctorName') || 'Doctor';
        startConversation({ doctorId })
          .unwrap()
          .then((res) => {
            handleSelect(res.data.conversationId, {
              _id: doctorId,
              name: doctorName,
            });
          });
      }
    }
  }, [searchParams, data]);

  const handleSelect = (conversationId: string, otherParty: any) => {
    setActiveConversationId(conversationId);
    setActiveOtherParty(otherParty);
  };

  return (
    <div className='flex h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm lens-card'>
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
              role: 'patient',
              name: (user as any).name || 'Patient',
            }}
            otherParty={activeOtherParty}
            onBack={() => setActiveConversationId(null)}
          />
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-center p-8'>
            <div className='w-16 h-16 rounded-2xl bg-black/[0.03] flex items-center justify-center mb-4'>
              <MessageSquare
                size={32}
                className='text-text-muted'
                strokeWidth={1.5}
              />
            </div>
            <h3 className='text-sm font-semibold font-heading text-text-primary'>
              {t('chat.noConversations')}
            </h3>
            <p className='text-sm font-body text-text-muted mt-1.5 max-w-[200px]'>
              {t('chat.startChat')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PatientChatPage() {
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
