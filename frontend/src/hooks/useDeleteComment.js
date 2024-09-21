import { useState } from 'react';


// hooks
import { useAuthContext } from './useAuthContext';


export const useDeleteComment = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const deleteComment = async ({ commentId }) => {
    setIsLoading(true);
    setError(null);

    const data = { commentId };

    const response = await fetch('http://localhost:4000/api/comment/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      },
      body: JSON.stringify(data)
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setIsLoading(false);
      console.log('Error:', json.error);
    }
    if (response.ok) {
      setIsLoading(false);
      return(json);
    }

  }

  return { deleteComment, error, isLoading };
}