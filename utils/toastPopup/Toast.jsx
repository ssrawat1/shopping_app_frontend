"use client"
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { useThemeContext } from '@/context/ThemeContext'

export const Toast = () => {
  const { isDark } = useThemeContext();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark ? '#1f2937' : '#fff',
          color: isDark ? '#fff' : '#000',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          padding: '16px',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: isDark ? '#14b8a6' : '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: isDark ? '#ef4444' : '#dc2626',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
};