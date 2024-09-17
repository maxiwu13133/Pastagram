import { useState, useEffect } from 'react';

// hooks
import { useAuthContext } from './useAuthContext';

export const useGetSearches = ({ username }) => {
  const { user } = useAuthContext();
  const [searches, setSearches] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const getSearches = async (username) => {
      setIsLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/search/' + username, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }
      if (response.ok) {
        setSearches(json.searches);
        setIsLoading(false);
      }
    }

    getSearches(username);
  }, [username, user.token])

  return { searches, error, isLoading };
}