import React, { ReactNode } from 'react';
import { AuthProvider } from './Auth';
import { ToastProvider } from './Toast';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);

export default AppProvider;
