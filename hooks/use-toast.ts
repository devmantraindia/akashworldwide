'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/stores';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export function useToast() {
  const { addNotification, removeNotification } = useNotificationStore();

  const toast = (type: 'success' | 'error' | 'info' | 'warning', message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    addNotification({ type, message, duration });

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  return {
    success: (message: string, duration?: number) => toast('success', message, duration),
    error: (message: string, duration?: number) => toast('error', message, duration),
    info: (message: string, duration?: number) => toast('info', message, duration),
    warning: (message: string, duration?: number) => toast('warning', message, duration),
  };
}
