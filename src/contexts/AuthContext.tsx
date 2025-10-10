import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type StoredUser = {
  username: string;
  password: string;
  fullName?: string;
};

type AuthUser = Omit<StoredUser, 'password'>;

type AuthError = 'invalid-credentials' | 'user-exists' | 'weak-password' | 'incomplete-data';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: true } | { success: false; error: AuthError }>;
  register: (
    username: string,
    password: string,
    fullName?: string
  ) => Promise<{ success: true } | { success: false; error: AuthError }>;
  logout: () => void;
}

const USERS_KEY = 'finance-david-users';
const SESSION_KEY = 'finance-david-session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn('Erro ao carregar usuários do armazenamento local:', error);
  }

  return [];
}

function persistUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureDefaultUser(users: StoredUser[]): StoredUser[] {
  const hasDefault = users.some((user) => user.username === 'davidbrenosantos');

  if (hasDefault) {
    return users;
  }

  return [
    ...users,
    {
      username: 'davidbrenosantos',
      password: '313722',
      fullName: 'Dr. David Breno'
    }
  ];
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawSession) as AuthUser;
      if (parsed && typeof parsed.username === 'string') {
        return parsed;
      }
    } catch (error) {
      console.warn('Erro ao restaurar sessão:', error);
    }

    return null;
  });

  useEffect(() => {
    const existingUsers = ensureDefaultUser(loadUsers());
    persistUsers(existingUsers);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const login: AuthContextValue['login'] = async (username, password) => {
      const sanitizedUser = username.trim().toLowerCase();
      const sanitizedPassword = password.trim();

      if (!sanitizedUser || !sanitizedPassword) {
        return { success: false, error: 'incomplete-data' };
      }

      const users = ensureDefaultUser(loadUsers());
      const storedUser = users.find((item) => item.username.toLowerCase() === sanitizedUser);

      if (!storedUser || storedUser.password !== sanitizedPassword) {
        return { success: false, error: 'invalid-credentials' };
      }

      const session: AuthUser = {
        username: storedUser.username,
        fullName: storedUser.fullName
      };

      setUser(session);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return { success: true };
    };

    const register: AuthContextValue['register'] = async (username, password, fullName) => {
      const sanitizedUser = username.trim();
      const sanitizedPassword = password.trim();

      if (!sanitizedUser || !sanitizedPassword) {
        return { success: false, error: 'incomplete-data' };
      }

      if (sanitizedPassword.length < 6) {
        return { success: false, error: 'weak-password' };
      }

      const users = ensureDefaultUser(loadUsers());
      const alreadyExists = users.some((item) => item.username.toLowerCase() === sanitizedUser.toLowerCase());

      if (alreadyExists) {
        return { success: false, error: 'user-exists' };
      }

      const newUser: StoredUser = {
        username: sanitizedUser,
        password: sanitizedPassword,
        fullName: fullName?.trim() || undefined
      };

      const updatedUsers = [...users, newUser];
      persistUsers(updatedUsers);
      const session: AuthUser = { username: newUser.username, fullName: newUser.fullName };
      setUser(session);
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return { success: true };
    };

    const logout = () => {
      setUser(null);
      localStorage.removeItem(SESSION_KEY);
    };

    return {
      user,
      isAuthenticated: user != null,
      login,
      register,
      logout
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }

  return context;
}
