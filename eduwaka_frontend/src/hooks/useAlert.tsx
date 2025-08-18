import { useContext } from 'react';
import { AlertContext, type AlertContextType } from '../context/AlertContext';

// The custom hook to consume the context
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
