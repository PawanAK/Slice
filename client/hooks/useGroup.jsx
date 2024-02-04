import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';

export const useGroup = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUserGroups = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('api/group/getUserGroups', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        }
);

        if (!response.ok) {
          throw new Error('Failed to fetch user groups');
        }

        const userGroups = await response.json();
        setGroups(userGroups);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  return { groups, isLoading, error };
};
