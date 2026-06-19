import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { expireSession } from '@/lib/authSession';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as { success: boolean; accessToken: string };
        localStorage.setItem('accessToken', data.accessToken);
        result = await baseQuery(args, api, extraOptions);
        if (result.error && result.error.status === 401) {
          expireSession();
        }
      } else {
        expireSession();
      }
    } else {
      expireSession();
    }
  }

  return result;
};

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AI'],
  endpoints: (builder) => ({
    parseTranscript: builder.mutation<
      {
        success: boolean;
        statusCode: number;
        data: {
          parsed: {
            diagnosis: string | null;
            medicines: Array<{
              name: string;
              dosage: string;
              frequency: string;
              duration: string;
            }>;
            notes: string | null;
            consultationFee: number | null;
            medicineCost: number | null;
          };
        };
        message: string;
      },
      { transcript: string; locale: 'en' | 'ur' }
    >({
      query: (body) => ({
        url: '/ai/prescriptions/parse',
        method: 'POST',
        body,
      }),
    }),

    parsePrescription: builder.mutation<
      {
        success: boolean;
        statusCode: number;
        data: {
          parsed: {
            diagnosis: string | null;
            medicines: Array<{
              name: string;
              dosage: string;
              frequency: string;
              duration: string;
            }>;
            notes: string | null;
            consultationFee: number | null;
            medicineCost: number | null;
          };
        };
        message: string;
      },
      { transcript: string; locale: 'en' | 'ur' }
    >({
      query: (body) => ({
        url: '/ai/prescriptions/parse',
        method: 'POST',
        body,
      }),
    }),

    // Gemini Chat
    geminiChat: builder.mutation<
      { success: boolean; data: { response: string }; message: string },
      { message: string; conversationHistory?: Array<{ role: string; content: string }> }
    >({
      query: (body) => ({
        url: '/ai/gemini/chat',
        method: 'POST',
        body,
      }),
    }),

    // Groq Chat
    groqChat: builder.mutation<
      { success: boolean; data: { reply: string }; message: string },
      { message: string; conversationHistory?: Array<{ role: string; content: string }> }
    >({
      query: (body) => ({
        url: '/ai/groq/chat',
        method: 'POST',
        body,
      }),
    }),

    chatWithAI: builder.mutation<any, { message: string; conversationHistory: any[]; language?: string }>({
      query: (body) => ({
        url: '/ai/groq/chat',
        method: 'POST',
        body,
      }),
    }),

    chatWithDoctorAI: builder.mutation<any, { message: string; conversationHistory: any[]; language?: string }>({
      query: (body) => ({
        url: '/ai/doctor/chat',
        method: 'POST',
        body,
      }),
    }),

    chatWithClinicAI: builder.mutation<any, { message: string; conversationHistory: any[]; language?: string }>({
      query: (body) => ({
        url: '/ai/clinic/chat',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useParseTranscriptMutation,
  useParsePrescriptionMutation,
  useGeminiChatMutation,
  useGroqChatMutation,
  useChatWithAIMutation,
  useChatWithDoctorAIMutation,
  useChatWithClinicAIMutation,
} = aiApi;
