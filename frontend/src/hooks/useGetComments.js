import { useState, useEffect } from 'react';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';


export const useGetComments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const getComments = async () => {
      
      const response = await fetch('http://localhost:4000/api/comment/' + post.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        setIsLoading(false);
        console.log('Error:', json.error);
      }
  
      if (response.ok) {
        setComments(json);
        setIsLoading(false);
      }
    }

    getComments();
  }, [post, user.token]);

  return { comments, error, isLoading };
}