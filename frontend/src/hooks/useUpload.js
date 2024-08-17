import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';


export const useUpload = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [postedImages, setPostedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [fileLength, setFileLength] = useState(null);


  
  // upload to cloudinary
  const upload = async (files, caption) => {
    setIsLoading(true);
    setError(null);
    setCaption(caption);
    setFileLength(files.length);

    for (const file of files) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

      await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      }).then(response => {
        return response.json();
      }).then(data => {
        setPostedImages(currentImages => [...currentImages, data.url]);
      }).catch(error => {
        setError(error);
      })
    };
  }

  // post to database
  useEffect(() => {
    const createPost = async () => {
      if (!error) {
        const data = {
          photos: postedImages,
          caption
        }
  
        const response = await fetch('http://localhost:4000/api/post/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ user.token }`
          },
          body: JSON.stringify(data)
        })
        const json = await response.json();
    
        if (!response.ok) {
          setError(json.error);
        }
        if (response.ok) {
          setIsLoading(false);
          setPostedImages([]);
        }
      }
    }

    if (postedImages.length === fileLength && postedImages.length !== 0) {
      createPost();
    }

  }, [postedImages, caption, error, fileLength, user.token])
  

  return { upload, error, isLoading };
};