'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { RootState } from '@/store/store';
import { addNotification } from '@/store/slices/notificationSlice';
import { patientApi } from '@/store/api/patientApi';
import { doctorApi } from '@/store/api/doctorApi';

const ChatSocketContext = createContext<any>(null);

export function ChatSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);
  const socketRef = useRef<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || apiUrl.replace(/\/api$/, '');

    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });
    setSocketReady(true);

    socketRef.current.on('connect', () => {
      if (user?._id) {
        socketRef.current?.emit('join', user._id);
      }
    });

    socketRef.current.on('new_message', () => {
      const onChatPage = pathname?.includes('/chat');
      if (!onChatPage) {
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    });

    // Real-time notification listener — dispatches to Redux so bell count + panel update instantly
    socketRef.current.on('notification', (data: any) => {
      dispatch(
        addNotification({
          id: data.id || data._id || String(Date.now()),
          title: data.title,
          message: data.message,
          titleKey: data.titleKey,
          bodyKey: data.bodyKey,
          bodyParams: data.bodyParams,
          type: data.type || 'info',
          read: false,
          createdAt: data.createdAt || new Date().toISOString(),
          actionUrl: data.actionUrl || data.link,
        }),
      );
    });

    // Handle new connection requests for patients
    socketRef.current.on('new_connection_request', (data: any) => {
      // Invalidate connections tag to refresh the list
      // @ts-ignore
      dispatch(patientApi.util.invalidateTags(['Connections']));

      // Also show a toast if available, or just rely on the notification if it's sent as one
      console.log('New connection request received:', data);
    });

    // Handle connection request handled for doctors/clinics
    socketRef.current.on('connection_request_handled', (data: any) => {
      // Invalidate patients tag to refresh the list
      // @ts-ignore
      dispatch(doctorApi.util.invalidateTags(['Patients']));

      console.log('Connection request handled:', data);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocketReady(false);
    };
  }, [token, user?._id, pathname, dispatch]);

  const joinConversation = (conversationId: string) => {
    socketRef.current?.emit('join_conversation', { conversationId });
  };

  const leaveConversation = (conversationId: string) => {
    socketRef.current?.emit('leave_conversation', { conversationId });
  };

  const sendMessage = (payload: {
    conversationId: string;
    senderId: string;
    senderRole: 'doctor' | 'patient';
    content: string;
    type?: 'text' | 'file';
    fileUrl?: string;
    fileName?: string;
  }) => {
    socketRef.current?.emit('send_message', payload);
  };

  const sendTyping = (
    conversationId: string,
    senderId: string,
    isTyping: boolean,
  ) => {
    socketRef.current?.emit('typing', { conversationId, senderId, isTyping });
  };

  const acknowledgeDelivered = (conversationId: string, messageId: string) => {
    socketRef.current?.emit('message_delivered', { conversationId, messageId });
  };

  const onNewMessage = (cb: (msg: any) => void) => {
    socketRef.current?.on('new_message', cb);
    return () => {
      socketRef.current?.off('new_message', cb);
    };
  };

  const onTypingStatus = (cb: (data: any) => void) => {
    socketRef.current?.on('typing_status', cb);
    return () => {
      socketRef.current?.off('typing_status', cb);
    };
  };

  const onConversationUpdated = (cb: (data: any) => void) => {
    socketRef.current?.on('conversation_updated', cb);
    return () => {
      socketRef.current?.off('conversation_updated', cb);
    };
  };

  const onMessagesRead = (cb: (data: any) => void) => {
    socketRef.current?.on('messages_read', cb);
    return () => {
      socketRef.current?.off('messages_read', cb);
    };
  };

  const onMessageDeleted = (cb: (data: any) => void) => {
    socketRef.current?.on('message_deleted', cb);
    return () => {
      socketRef.current?.off('message_deleted', cb);
    };
  };

  const onMessageStatusUpdated = (cb: (data: any) => void) => {
    socketRef.current?.on('message_status_updated', cb);
    return () => {
      socketRef.current?.off('message_status_updated', cb);
    };
  };

  return (
    <ChatSocketContext.Provider
      value={{
        socket: socketRef.current,
        socketReady,
        joinConversation,
        leaveConversation,
        sendMessage,
        sendTyping,
        acknowledgeDelivered,
        onNewMessage,
        onTypingStatus,
        onConversationUpdated,
        onMessagesRead,
        onMessageDeleted,
        onMessageStatusUpdated,
      }}
    >
      {children}
    </ChatSocketContext.Provider>
  );
}

export const useChatSocket = () => useContext(ChatSocketContext);
