import { useState, useEffect } from 'react';


// hooks
import { useAuthContext } from './useAuthContext';


export const useGetSaved = () => {
  const { user } = useAuthContext();
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const getSaved = async () => {
      const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/saved/', {
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
      };
      if (response.ok) {
        setIsLoading(false);
        setSaved(json.saved);
      };
    }

    getSaved();
  }, [user.token])

  return { saved, error, isLoading };
}