import { useState } from 'react';


export const useGetUserInfo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  
  const getUserInfo = async (username) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch('http://localhost:4000/api/user/community/' + username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    };

    if (response.ok) {
      setIsLoading(false);
      return json
    };
  };

  return { getUserInfo, error, isLoading };
}