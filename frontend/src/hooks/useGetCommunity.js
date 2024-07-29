import { useState, useEffect } from 'react';

export const useGetCommunity = (username) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const getCommunity = async (user) => {
      setIsLoading(true);
      setError(null);
  
      const response = await fetch('/api/user/community/' + user.username, {
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
        setFollowers(json.followers);
        setFollowing(json.following);
      };
    };

    getCommunity(username);
  }, [username])

  return { followers, following, error, isLoading };
};
