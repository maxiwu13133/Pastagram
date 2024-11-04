import { useState } from 'react';
import { useAuthContext } from './useAuthContext';


export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (identifier, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier, password })
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log('Error:', json.error);
    };

    if (response.ok) {

      // clear current user
      dispatch({ type: 'LOGOUT' });

      // save user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // update auth context
      dispatch({ type: 'LOGIN', payload: json });

      setIsLoading(false);
    };
  };
  

  return { login, isLoading, error };
};
