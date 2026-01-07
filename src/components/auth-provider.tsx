import React, { createContext, useContext, useEffect, useState } from 'react';
import { blink } from '@/lib/blink';
import type { BlinkUser } from '@blinkdotnew/sdk';

interface AuthContextType {
  user: BlinkUser | null;
  loading: boolean;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BlinkUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user);
      
      if (state.user) {
        // Fetch role from profiles table
        try {
          const profile = await blink.db.profiles.get(state.user.id);
          if (profile) {
            setRole(profile.role);
          } else {
            // Check if any admin exists
            const admins = await blink.db.profiles.list({
              where: { role: 'admin' },
              limit: 1
            });
            
            const initialRole = admins.length === 0 ? 'admin' : 'customer';
            
            // Create default profile if not exists
            await blink.db.profiles.create({
              userId: state.user.id,
              role: initialRole,
              fullName: state.user.displayName || '',
            });
            setRole(initialRole);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setRole('customer');
        }
      } else {
        setRole(null);
      }
      
      setLoading(state.isLoading);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
