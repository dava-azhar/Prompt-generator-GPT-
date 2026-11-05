import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, onAuthStateChanged } from '../services/firebase';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return { currentUser, loading, signIn, signOut };
}
