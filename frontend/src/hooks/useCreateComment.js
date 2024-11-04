import { useState } from 'react';

// hooks
import { useAuthContext } from './useAuthContext';

export const useCreateComment = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();
  
  const createComment = async ({ post, text }) => {
    setIsLoading(true);
    setError(null);

    const data = { post, text };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      },
      body: JSON.stringify(data)
    })
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

  return { createComment, error, isLoading };
}