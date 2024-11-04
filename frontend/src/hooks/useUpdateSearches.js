import { useState } from 'react';

// hooks
import { useAuthContext } from './useAuthContext';


export const useUpdateSearches = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const addSearch = async ({ username, search }) => {
    setIsLoading(true);
    setError(null);

    const data = { username, search };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/search/add', {
      method: 'PATCH',
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
    }
    if (response.ok) {
      setIsLoading(false);
      return json;
    }
  }

  const removeSearch = async ({ username, search }) => {
    setIsLoading(true);
    setError(null);

    const data = { username, search };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/search/remove', { 
      method: 'PATCH',
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
    }
    if (response.ok) {
      setIsLoading(false);
      return json;
    }
  }

  const clearSearch = async ({ username }) => {
    setIsLoading(true);
    setError(null);

    const data = { username };
    
    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/search/clear', {
      method: 'PATCH',
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
    }
    if (response.ok) {
      setIsLoading(false);
      return json;
    }
    
  }

  return { addSearch, removeSearch, clearSearch, error, isLoading };
}