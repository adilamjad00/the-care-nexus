import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";

export const onboardingApi = createApi({
  reducerPath: "onboardingApi",
  baseQuery,
  endpoints: (builder) => ({
    markOnboardingComplete: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/onboarding/complete",
        method: "PATCH",
      }),
    }),
    markProfileComplete: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/onboarding/profile-complete",
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useMarkOnboardingCompleteMutation,
  useMarkProfileCompleteMutation,
} = onboardingApi;
