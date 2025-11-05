import React, {
  createContext, useCallback, useContext, useState, ReactNode,
} from 'react';
import api from '../services/api';

// Mock de usuários para desenvolvimento
const mockUsers = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@gobarber.com',
    password: '123456',
    avatar_url: 'https://github.com/Pedrohbraga06.png'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    try {
      const mockUser = {
        id: '1',
        name: 'Admin',
        email: 'admin@gobarber.com',
        avatar_url: 'https://github.com/Pedrohbraga06.png'
      };
      const mockToken = 'mock-token-123';

      // Simula verificação de credenciais
      if (email === 'admin@gobarber.com' && password === '123456') {
        api.defaults.headers.Authorization = `Bearer ${mockToken}`;
        localStorage.setItem('@GoBarber:token', mockToken);
        localStorage.setItem('@GoBarber:user', JSON.stringify(mockUser));
        setData({ token: mockToken, user: mockUser });
        return;
      }

      // Se as credenciais não corresponderem, tenta a API
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { token, user } = response.data;
      api.defaults.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem('@GoBarber:token', token);
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({ token, user });
    } catch (error) {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
