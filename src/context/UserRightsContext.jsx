import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const UserRightsContext = createContext(null);

export function UserRightsProvider({ children }) {
  const { user } = useAuth();
  const [rights, setRights] = useState({});
  const [loadingRights, setLoadingRights] = useState(false);
  const [rightsError, setRightsError] = useState(null);

  useEffect(() => {
    const loadRights = async () => {
      if (!user?.id) {
        setRights({});
        return;
      }

      setLoadingRights(true);
      setRightsError(null);

      const { data, error } = await supabase
        .from('UserModule_Rights')
        .select('has_right, rights(right_name), user_module!inner(user_id)')
        .eq('user_module.user_id', user.id);

      if (error) {
        setRightsError(error.message || 'Failed to load user rights');
        setRights({});
      } else {
        const rightsMap = {};
        data?.forEach((row) => {
          const rightName = row?.rights?.right_name;
          if (rightName) {
            rightsMap[rightName] = row.has_right === 1 || row.has_right === true;
          }
        });
        setRights(rightsMap);
      }

      setLoadingRights(false);
    };

    loadRights();
  }, [user]);

  const value = {
    rights,
    loadingRights,
    rightsError,
    hasRight: (rightName) => Boolean(rights[rightName]),
  };

  return <UserRightsContext.Provider value={value}>{children}</UserRightsContext.Provider>;
}

export function useRights() {
  const context = useContext(UserRightsContext);
  if (!context) {
    throw new Error('useRights must be used within UserRightsProvider');
  }
  return context;
}
