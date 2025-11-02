import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts
const DEMO_USERS: User[] = [
  { id: '1', email: 'student@demo.com', name: 'Demo Student', role: 'student' },
  { id: '2', email: 'teacher@demo.com', name: 'Demo Teacher', role: 'teacher' },
  { id: '3', email: 'admin@demo.com', name: 'Demo Admin', role: 'admin' },
];

const DEMO_PASSWORD = 'demo123';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage synchronously to avoid a race where
  // components redirect before the stored session is restored (opening
  // the app in a new tab was causing the session to appear "destroyed").
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('edutrack_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch (e) {
      console.error('Failed to parse stored user', e);
      return null;
    }
  });
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = DEMO_USERS.find(u => u.email === email);
    
    if (foundUser && password === DEMO_PASSWORD) {
      setUser(foundUser);
      localStorage.setItem('edutrack_user', JSON.stringify(foundUser));
      
      // Navigate based on role
      switch (foundUser.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
      }
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edutrack_user');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
