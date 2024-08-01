import { useDropzone } from 'react-dropzone'

export const useDropzoneNC = ({ onDrop }) => {
  const {acceptedFiles, getRootProps, isDragActive} = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 10,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mpeg4', '.mov'] 
    } });

  return { acceptedFiles, getRootProps, isDragActive };
}