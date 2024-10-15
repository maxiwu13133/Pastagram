import { useState } from 'react';


// hooks
import { useAuthContext } from './useAuthContext';


export const useGetDeleted = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getDeleted = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('http://localhost:4000/api/account/deleted/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ user.token }`
      }
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setIsLoading(false);
      console.log('Error:', json.error);
    }

    if (response.ok) {
      setIsLoading(false);
      return json;
    }
  }

  return { getDeleted, error, isLoading };
}