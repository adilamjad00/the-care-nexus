import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { patientApi } from './patientApi';
import { expireSession } from '@/lib/authSession';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api',
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
    // Try to get a new token
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
        // Store the new token
        const data = refreshResult.data as { success: boolean; accessToken: string };
        localStorage.setItem('accessToken', data.accessToken);

        // Retry the original query with new token
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

  // Normalize error messages
  if (result.error) {
    const error = result.error as any;

    if (error.status === "FETCH_ERROR") {
      return {
        error: {
          ...error,
          data: {
            message: "Network error. Please check your connection and try again.",
          },
        },
      };
    }

    if (error.status === "PARSING_ERROR") {
      return {
        error: {
          ...error,
          data: {
            message: "Server error. Please try again later.",
          },
        },
      };
    }

    if (error.status === "TIMEOUT_ERROR") {
      return {
        error: {
          ...error,
          data: {
            message: "Request timeout. Please try again.",
          },
        },
      };
    }

    if (!error.data?.message && error.status) {
      return {
        error: {
          ...error,
          data: {
            ...error.data,
            message: `Request failed with status ${error.status}`,
          },
        },
      };
    }
  }

  return result;
};

export const doctorApi = createApi({
  reducerPath: 'doctorApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Patients', 'Records', 'Prescriptions', 'Appointments', 'Schedule', 'DoctorAppointmentDetail', 'DoctorProfile'],
  endpoints: (builder) => ({
    // Patients
    getPatients: builder.query({
      query: (params) => ({
        url: '/doctor/patients',
        params,
      }),
      providesTags: ['Patients'],
    }),
    getPatientById: builder.query({
      query: (id) => `/doctor/patients/${id}`,
      providesTags: ['Patients'],
    }),
    createPatient: builder.mutation({
      query: (body) => ({
        url: '/doctor/patients',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Patients'],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/doctor/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patients'],
    }),
    getPatientAppointmentHistory: builder.query({
      query: (id) => `/doctor/patients/${id}/appointments`,
      providesTags: ['Appointments'],
    }),
    deleteRecord: builder.mutation({
      query: (id: string) => ({
        url: `/doctor/records/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patients', 'Records'],
    }),
    getRecordById: builder.query({
      query: (id) => `/doctor/records/${id}`,
      providesTags: ['Records'],
    }),
    searchPatients: builder.query({
      query: (query) => ({
        url: '/doctor/patients/search',
        params: { query },
      }),
    }),
    findPatientByEmail: builder.query({
      query: (email) => ({
        url: '/doctor/patients/find',
        params: { email },
      }),
    }),

    // Prescriptions
    getPrescriptions: builder.query({
      query: (params) => ({
        url: '/doctor/prescriptions',
        params,
      }),
      providesTags: ['Prescriptions'],
    }),
    getPrescriptionById: builder.query({
      query: (id) => `/doctor/prescriptions/${id}`,
      providesTags: ['Prescriptions'],
    }),
    createPrescription: builder.mutation({
      query: (body) => ({
        url: '/doctor/prescriptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Prescriptions', 'Appointments', 'DoctorAppointmentDetail'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(patientApi.util.invalidateTags(['Records', 'Dashboard']));
        } catch {
          // Ignore; the mutation error will surface through the mutation state.
        }
      },
    }),
    updatePrescription: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/doctor/prescriptions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Prescriptions', 'DoctorAppointmentDetail'],
    }),
    deletePrescription: builder.mutation({
      query: (id) => ({
        url: `/doctor/prescriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prescriptions', 'DoctorAppointmentDetail'],
    }),

    // Appointments
    getAppointments: builder.query({
      query: (params) => ({
        url: '/doctor/appointments',
        params,
      }),
      providesTags: ['Appointments'],
    }),
    getAppointmentById: builder.query({
      query: (id) => `/doctor/appointments/${id}`,
      providesTags: ['DoctorAppointmentDetail'],
    }),
    getTodayQueue: builder.query({
      query: () => '/doctor/appointments/today',
      providesTags: ['Appointments'],
    }),
    createAppointment: builder.mutation({
      query: (body) => ({
        url: '/doctor/appointments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/doctor/appointments/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Appointments', 'DoctorAppointmentDetail'],
    }),
    completeAppointment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/doctor/appointments/${id}/complete`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Appointments', 'DoctorAppointmentDetail'],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/doctor/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Appointments', 'DoctorAppointmentDetail'],
    }),

    // Schedule
    getSchedule: builder.query({
      query: () => '/doctor/schedule',
      providesTags: ['Schedule'],
    }),
    updateSchedule: builder.mutation({
      query: (body) => ({
        url: '/doctor/schedule',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Schedule'],
    }),

    // Profile
    getDoctorProfile: builder.query({
      query: () => '/doctor/profile',
      providesTags: ['DoctorProfile'],
    }),
    updateDoctorProfile: builder.mutation({
      query: (body) => ({
        url: '/doctor/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['DoctorProfile'],
    }),

    // Revenue
    getRevenueAnalytics: builder.query({
      query: (period) => ({
        url: '/doctor/revenue',
        params: { period },
      }),
    }),
    getRevenueHistory: builder.query({
      query: (params = { page: 1, limit: 20 }) => ({
        url: '/doctor/revenue/history',
        params,
      }),
    }),
    deleteRevenueHistoryRecord: builder.mutation({
      query: (id: string) => ({
        url: `/doctor/revenue/history/${id}`,
        method: 'DELETE',
      }),
    }),
    clearRevenueHistory: builder.mutation<void, void>({
      query: () => ({
        url: '/doctor/revenue/history',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useDeleteRecordMutation,
  useCreatePatientMutation,
  useSearchPatientsQuery,
  useFindPatientByEmailQuery,
  useDeletePatientMutation,
  useGetPatientAppointmentHistoryQuery,
  useGetRecordByIdQuery,
  useGetPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useGetTodayQueueQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useCompleteAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetScheduleQuery,
  useUpdateScheduleMutation,
  useGetDoctorProfileQuery,
  useUpdateDoctorProfileMutation,
  useGetRevenueAnalyticsQuery,
  useGetRevenueHistoryQuery,
  useDeleteRevenueHistoryRecordMutation,
  useClearRevenueHistoryMutation,
} = doctorApi;

