import { isAxiosError } from 'axios';

export type AppNotificationType = 'error' | 'success' | 'info';

export interface AppNotificationPayload {
    title?: string;
    message: string;
    type?: AppNotificationType;
}

type NotificationListener = (payload: AppNotificationPayload) => void;

const listeners = new Set<NotificationListener>();

export const subscribeToNotifications = (listener: NotificationListener) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

export const showNotification = ({ title, message, type = 'info' }: AppNotificationPayload) => {
    listeners.forEach((listener) => {
        listener({ title, message, type });
    });
};

export const showErrorNotification = (message: string, title = 'Something went wrong') => {
    showNotification({
        title,
        message,
        type: 'error',
    });
};

export const showSuccessNotification = (message: string, title = 'Success') => {
    showNotification({
        title,
        message,
        type: 'success',
    });
};

export const getUserFriendlyErrorMessage = (
    error: unknown,
    fallbackMessage = 'Something went wrong. Please try again.'
) => {
    if (isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
            return 'The server took too long to respond. Please try again in a moment.';
        }

        if (!error.response || error.message === 'Network Error') {
            return 'We could not connect right now. Please check your internet or server connection and try again.';
        }

        const responseMessage =
            error.response.data?.detail ||
            error.response.data?.message ||
            error.message;

        return typeof responseMessage === 'string' && responseMessage.trim()
            ? responseMessage
            : fallbackMessage;
    }

    if (error instanceof Error) {
        if (
            error.message.includes('Network Error') ||
            error.message.includes('Failed to fetch')
        ) {
            return 'We could not connect right now. Please check your internet or server connection and try again.';
        }

        return error.message.trim() || fallbackMessage;
    }

    return fallbackMessage;
};
