import { useState } from 'react';
import { useAuthContext } from "./useAuthContext";


export const useGetCommunity = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getCommunity = async (username) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/community', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username })
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    };

    if (response.ok) {
      setIsLoading(false);
      return (json);
    };
  };

  return { getCommunity, error, isLoading };
};
