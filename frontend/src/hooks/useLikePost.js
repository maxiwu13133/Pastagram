import { useState } from 'react';


export const useLikePost = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const likePost = async ({ post, user }) => {
    setIsLoading(true);
    setError(null);

    const data = { id: post._id, username: user.username };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/post/like/', {
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
      console.log('Error:', json.error);
    }
    if (response.ok) {
      setIsLoading(false);
      return json;
    }
  }


  return { likePost, error, isLoading };
}