"use client"
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { useThemeContext } from '@/context/ThemeContext'

export const Toast = () => {
  const { isDark } = useThemeContext();

  return (
    <>
      <style jsx global>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
      
      <Toaster
        position="top-right"
        containerStyle={{
          top: 80,
          right: 20,
        }}
        toastOptions={{
          duration: 1000,
          style: {
            background: isDark ? '#1f2937' : '#fff',
            color: isDark ? '#fff' : '#000',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            padding: '16px',
            borderRadius: '8px',
            animation: 'slideInFromRight 0.3s ease-out forwards',
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
    </>
  );
};

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
};