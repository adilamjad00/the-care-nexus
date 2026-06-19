import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi";

type NotificationQueryArg =
    | string
    | {
        portal?: string;
        page?: number;
        limit?: number;
        read?: boolean;
    };

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery,
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getNotifications: builder.query<any, NotificationQueryArg | void>({
            query: (arg) => {
                const params = typeof arg === "string"
                    ? { portal: arg }
                    : {
                        portal: arg?.portal,
                        page: arg?.page,
                        limit: arg?.limit,
                        read: typeof arg?.read === "boolean" ? String(arg.read) : undefined,
                    };

                return {
                    url: "/notifications",
                    params,
                };
            },
            providesTags: ["Notifications"],
        }),
        markAsRead: builder.mutation<any, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllAsRead: builder.mutation<any, void>({
            query: () => ({
                url: "/notifications/mark-all-read",
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),
        deleteNotification: builder.mutation<any, string>({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications"],
        }),
        clearAllNotifications: builder.mutation<any, void>({
            query: () => ({
                url: "/notifications/clear-all",
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications"],
        }),
        getNotificationPreferences: builder.query<any, void>({
            query: () => ({
                url: "/notifications/preferences",
            }),
            providesTags: ["Notifications"],
        }),
        updateNotificationPreferences: builder.mutation<any, Record<string, boolean>>({
            query: (body) => ({
                url: "/notifications/preferences",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useClearAllNotificationsMutation,
    useGetNotificationPreferencesQuery,
    useUpdateNotificationPreferencesMutation,
} = notificationApi;
