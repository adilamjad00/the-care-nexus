import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Conversations', 'Messages'],
  endpoints: (builder) => ({
    getConversations: builder.query<any, { viewerRole: 'doctor' | 'patient' }>({
      query: ({ viewerRole }) => `/chat/conversations?viewerRole=${viewerRole}`,
      providesTags: ['Conversations'],
    }),
    getMessages: builder.query<any, string>({
      query: (conversationId) => `/chat/conversations/${conversationId}/messages`,
      providesTags: ['Messages'],
    }),
    startConversation: builder.mutation<any, { doctorId?: string; patientId?: string }>({
      query: (body) => ({ url: '/chat/conversations', method: 'POST', body }),
      invalidatesTags: ['Conversations'],
    }),
    markRead: builder.mutation<any, { conversationId: string; viewerRole: 'doctor' | 'patient' }>({
      query: ({ conversationId, viewerRole }) => ({
        url: `/chat/conversations/${conversationId}/read?viewerRole=${viewerRole}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversations'],
    }),
    uploadFile: builder.mutation<any, { conversationId: string; formData: FormData }>({
      query: ({ conversationId, formData }) => ({
        url: `/chat/conversations/${conversationId}/upload`,
        method: 'POST',
        body: formData,
      }),
    }),
    deleteMessage: builder.mutation<any, string>({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages'],
    }),
    deleteConversation: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversations', 'Messages'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useStartConversationMutation,
  useMarkReadMutation,
  useUploadFileMutation,
  useDeleteMessageMutation,
  useDeleteConversationMutation,
} = chatApi;
