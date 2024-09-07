import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useDeletePost = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const deletePost = async (post) => {
    setIsLoading(true);
    setError(null);
    
    const response = await fetch('http://localhost:4000/api/post/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      },
      body: JSON.stringify(post)
    })
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

  return { deletePost, error, isLoading };
}