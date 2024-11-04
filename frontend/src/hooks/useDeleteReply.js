import { useState } from 'react';


// hooks
import { useAuthContext } from './useAuthContext';


export const useDeleteReply = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const deleteReply = async ({ replyId }) => {
    setIsLoading(true);
    setError(null);

    const data = { replyId };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/reply/', {
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
      console.log('Error:', json.error);
      setIsLoading(false);
    };
    if (response.ok) {
      setIsLoading(false);
      return json;
    };
  };

  return { deleteReply, error, isLoading };
}