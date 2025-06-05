import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { AuthContextProps } from '../context/AuthTypes';

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
