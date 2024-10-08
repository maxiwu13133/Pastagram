import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

export const useCreatePost = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const createPost = async (files, caption) => {
    setIsLoading(true);
    setError(null);
    const data = { files, caption };

    const response = await fetch('http://localhost:4000/api/post/', {
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
      return json;
    }
  }

  return { createPost, error, isLoading };

}