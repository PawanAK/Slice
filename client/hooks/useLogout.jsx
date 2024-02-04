import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Perform any necessary cleanup on the server-side (e.g., invalidate tokens).

      // Clear user from local storage
      localStorage.removeItem('user');

      // Update auth context
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};
