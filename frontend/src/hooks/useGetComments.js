import { useState } from 'react';


// hooks
import { useAuthContext } from '../hooks/useAuthContext';


export const useGetComments = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getComments = async ({ postId }) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('http://localhost:4000/api/comment/' + postId, {
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


  return { getComments, error, isLoading };
}