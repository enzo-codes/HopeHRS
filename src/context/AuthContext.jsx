import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [userType, setUserType] = useState('USER');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Fetch the user_type from the application `user` table.
  // user_metadata is set by Supabase Auth and does NOT contain user_type —
  // that field lives in our own `user` table managed by the provision trigger.
  const fetchUserType = async (userId) => {
    if (!userId) {
      setUserType('USER');
      return;
    }
    const { data, error } = await supabase
      .from('user')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (error || !data?.user_type) {
      setUserType('USER');
    } else {
      setUserType(data.user_type.toUpperCase());
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        await fetchUserType(user?.id);
      } catch (err) {
        setError(err.message || 'Failed to get user');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      await fetchUserType(sessionUser?.id);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      await fetchUserType(data.user?.id);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      return { data: null, error: err };
    }
  };

  const signInWithOAuth = async (provider = 'google') => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err.message || `Failed to sign in with ${provider}`;
      setError(errorMessage);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserType('USER');
      return { error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign out';
      setError(errorMessage);
      return { error: err };
    }
  };

  const value = {
    user,
    userType,
    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}