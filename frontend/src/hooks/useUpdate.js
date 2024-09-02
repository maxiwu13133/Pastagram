import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useUpdate = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const updateProfile = async ({ email, fullName, username, bio, pfp, pfpChanged }) => {
    setIsLoading(true);
    setError(null);

    if (pfpChanged) {
      const reader = new FileReader();
      reader.readAsDataURL(pfp);
      reader.onloadend = async () => {
        const data = { 
          email,
          fullName,
          username,
          bio,
          pfp: reader.result,
          user_username: user.username,
          pfpChanged
        };
        const response = await fetch('http://localhost:4000/api/account/update/', {
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
          setIsLoading(false);
          console.log("Error:", json.error);
        }
        if (response.ok) {
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          console.log("Change:", json);
          return json;
        }
      }
    } else {
      const data = { 
        email,
        fullName,
        username,
        bio,
        pfp: pfp,
        user_username: user.username,
        pfpChanged
      };
      const response = await fetch('http://localhost:4000/api/account/update/', {
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
        setIsLoading(false);
        console.log("Error:", json.error);
      }
      if (response.ok) {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        console.log("No change:", json);
        return json;
      }
    }
  }

  return { updateProfile, error, isLoading };

}