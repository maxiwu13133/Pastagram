import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';


export const useUpdateProfile = () => {
  const { user, dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState(null);
  const [uploadFinish, setUploadFinish] = useState(null);


  // upload to cloudinary
  const update = async ({ email, fullName, username, bio, pfp, pfpChanged }) => {
    setIsLoading(true);
    setError(null);
    setEmail(email);
    setFullName(fullName);
    setUsername(username);
    setBio(bio);

    if (pfpChanged) {
      const data = new FormData();
      data.append('file', pfp);
      data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

      await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      }).then(response => {
        return response.json();
      }).then(data => {
        setPicture(data.url);
        console.log(data);
        setUploadFinish(true);
      }).catch(error => {
        setError(error);
      })
    } else {
      setUploadFinish(true);
    }
  }

  useEffect(() => {
    const updateUser = async() => {
      const info = { email, fullName, username, bio, picture, user_username: user.username };

      const response = await fetch('http://localhost:4000/api/account/update/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ user.token }`
        },
        body: JSON.stringify(info)
      })
      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }

      if (response.ok) {
        user.username = json.username;
        user.picture = json.picture;
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN', payload: user });
        setTimeout(() => {
          setIsLoading(false);
        }, 2000)
      }
    }

    if (uploadFinish && !error) {
      updateUser();
      setUploadFinish(false);
    }
  }, [email, fullName, username, bio, picture, error, user, dispatch, uploadFinish])

  return { update, error, isLoading };
}