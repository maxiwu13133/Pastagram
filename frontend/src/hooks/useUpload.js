import { useState } from 'react';


export const useUpload = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [postedImages, setPostedImages] = useState([]);
  

  const upload = async (files, caption) => {
    setIsLoading(true);
    setError(null);

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
        setPostedImages(postedImages => [...postedImages, data.url]);
      }).catch(error => {
        console.log('Error:', error);
      })
    };

    console.log(postedImages);
  }

  return { upload, error, isLoading};
};