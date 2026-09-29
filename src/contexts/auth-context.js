import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { loginUser } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const [token, savedUser] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('user'),
        ]);
        if (active && token && savedUser) {
          setSession({ token, user: JSON.parse(savedUser) });
        }
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  async function signIn(email, password) {
    const result = await loginUser(email, password);
    if (!result?.token || !result?.user) {
      throw new Error(result?.message || 'The login response did not include a token and user.');
    }

    const user = {
      id: result.user.id ?? result.user._id ?? '',
      name: result.user.name ?? email.split('@')[0],
      email: result.user.email ?? email,
    };
    await Promise.all([
      AsyncStorage.setItem('token', result.token),
      AsyncStorage.setItem('user', JSON.stringify(user)),
    ]);
    setSession({ token: result.token, user });
  }

  async function signOut() {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } finally {
      setSession(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isLoading,
        signIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}