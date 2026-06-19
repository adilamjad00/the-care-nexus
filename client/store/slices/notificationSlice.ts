import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
    id: string;
    _id?: string;
    title: string;
    message: string;
    titleKey?: string;
    bodyKey?: string;
    bodyParams?: Record<string, any>;
    actionUrl?: string;
    type: string;
    read: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload?.filter((n) => !n.read).length;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadCount += 1;
            }
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find((n) => (n.id === action.payload || (n as any)._id === action.payload));
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            const index = state.notifications.findIndex((n) => (n.id === action.payload || (n as any)._id === action.payload));
            if (index !== -1) {
                if (!state.notifications[index].read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.notifications.splice(index, 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach((n) => (n.read = true));
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
