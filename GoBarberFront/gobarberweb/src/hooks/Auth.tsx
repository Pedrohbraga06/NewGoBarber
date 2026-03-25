import React, {
  createContext, useCallback, useContext, useState, ReactNode,
} from 'react';
import axios from 'axios';
import api from '../services/api';

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
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const getAuthErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (responseData && typeof responseData === 'object') {
      const message = 'message' in responseData ? responseData.message : null;
      const errorText = 'error' in responseData ? responseData.error : null;

      if (typeof message === 'string' && message.trim()) {
        return message;
      }

      if (typeof errorText === 'string' && errorText.trim()) {
        return errorText;
      }
    }

    if (!error.response) {
      return 'Nao foi possivel conectar ao backend. Verifique se a API esta rodando em http://localhost:3333.';
    }

    if (error.response.status === 401) {
      return 'E-mail ou senha incorretos. Tente novamente.';
    }

    if (error.response.status === 400) {
      return 'Os dados informados sao invalidos. Revise e tente novamente.';
    }
  }

  if (error instanceof Error && error.message === 'Invalid response from server') {
    return 'A API respondeu sem token ou usuario. Confira o backend de autenticacao.';
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'Nao foi possivel fazer login. Verifique suas credenciais e tente novamente.';
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    try {
      setLoading(true);

      const response = await api.post('/sessions', {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      // Valida resposta
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('@GoBarber:token', token);
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({ token, user });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    delete api.defaults.headers.common.Authorization;
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
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
