import { useState } from 'react';

// hooks
import { useAuthContext } from './useAuthContext';
import { usePfpContext } from './usePfpContext.js';

export const useUpdate = () => {
  const { user, dispatch } = useAuthContext();
  const { dispatch: pfpDispatch } = usePfpContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const updateProfile = async ({ email, fullName, username, bio, pfp, pfpChanged }) => {
    setIsLoading(true);
    setError(null);

    if (pfpChanged) {

      const response = await fetch('http://localhost:4000/api/account/pfp/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const json = await response.json();
    
      if (!response.ok) {
        setError(json.error);
        console.log("Error:", json.error);
        return;
      }

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
          const newAuth = { username: json.username, token: user.token };
          localStorage.setItem('user', JSON.stringify(newAuth));
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          pfpDispatch({ type: 'SET_PFP', payload: json.pfp });
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
        const newAuth = { username: json.username, token: user.token };
        localStorage.setItem('user', JSON.stringify(newAuth));
        dispatch({ type: 'LOGIN', payload: newAuth });
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return json;
      }
    }
  }

  return { updateProfile, error, isLoading };

}