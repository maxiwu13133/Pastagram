import { useState, useEffect } from 'react';

export const useGetCommunity = (username) => {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const getCommunity = async (user) => {
      setIsLoading(true);
      setError(null);
  
      const response = await fetch('http://localhost:4000/api/user/community/' + user.username, {
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
        setFullName(json.fullName);
        setBio(json.bio);
        setFollowers(json.followers);
        setFollowing(json.following);
        setIsLoading(false);
      };
    };

    getCommunity(username);
  }, [username])

  return { fullName, bio, followers, following, error, isLoading };
};
