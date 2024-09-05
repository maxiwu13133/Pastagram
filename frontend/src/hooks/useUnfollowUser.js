import { useState } from 'react';


export const useUnfollowUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const unfollowUser = async ({ username, targetUsername }) => {
    setIsLoading(true);
    setError(null);

    const data = { username, targetUsername };

    const response = await fetch('http://localhost:4000/api/user/unfollow/', {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setIsLoading(false);
      console.log("Error:", json.error);
    }

    if (response.ok) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }

  return { unfollowUser, error, isLoading };
}