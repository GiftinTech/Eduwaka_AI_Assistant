// src/context/AlertContext.tsx

import { createContext, useState, type ReactNode } from 'react';

// Define the shape of the data that will be in the context
interface AlertState {
  type: 'success' | 'error' | 'info';
  message: string;
  duration: number;
}

// Define the shape of the context object itself
export interface AlertContextType {
  alert: AlertState | null;
  showAlert: (
    type: 'success' | 'error' | 'info',
    message: string,
    duration?: number,
  ) => void;
  hideAlert: () => void;
}

// Create the context
// eslint-disable-next-line react-refresh/only-export-components
export const AlertContext = createContext<AlertContextType | undefined>(
  undefined,
);

// The Provider component that will wrap your app
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (
    type: 'success' | 'error' | 'info',
    message: string,
    duration = 5,
  ) => {
    setAlert({ type, message, duration });
    //console.log('Alert state updated:', { type, message, duration }); // Check this log
    setTimeout(() => {
      setAlert(null);
    }, duration * 1000);
  };

  const hideAlert = () => setAlert(null);

  const value = { alert, showAlert, hideAlert };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};
