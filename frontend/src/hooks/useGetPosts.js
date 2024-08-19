import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';


export const useGetPosts = (username) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();


  useEffect(() => {
    const getPosts = async (username) => {
      setIsLoading(true);
      setError(null);
  
      const response = await fetch('http://localhost:4000/api/post/' + username, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
  
      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      };
  
      if (response.ok) {
        setIsLoading(false);
        setPosts(json.posts);
      };
    };
  
    getPosts(username);
  }, [username, user.token])

  return { posts, error, isLoading }
}