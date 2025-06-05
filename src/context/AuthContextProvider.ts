import { createContext } from 'react';
import { AuthContextProps } from './AuthTypes';

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
