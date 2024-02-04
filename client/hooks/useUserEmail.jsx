// useUserEmail.js
import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';

const useUserEmail = (userId) => {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUserEmail = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/user/${userId}/email`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch email for user ${userId}`);
        }

        const data = await response.json();
        setEmail(data.email);
      } catch (error) {
        setError(`Error fetching email for user ${userId}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserEmail();
    }
  }, [userId]);

  return { email, loading, error };
};

export default useUserEmail;
