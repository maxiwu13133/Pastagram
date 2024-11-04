import { useState } from 'react';


// hooks
import { useAuthContext } from './useAuthContext';


export const useSavedAPI = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getSaved = async ({ id }) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/saved/' + id, {
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
      return json;
    };
  };

  const addSaved = async ({ postId }) => {
    setIsLoading(true);
    setError(null);

    const data = { postId };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/saved/add', {
      method: 'PATCH',
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
    };
    if (response.ok) {
      setIsLoading(false);
      return json;
    };
  };

  const removeSaved = async ({ postId }) => {
    setIsLoading(true);
    setError(null);

    const data = { postId };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/saved/remove', {
      method: 'PATCH',
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
    };
    if (response.ok) {
      setIsLoading(false);
      return json;
    };
  };

  return { getSaved, addSaved, removeSaved, error, isLoading };
}