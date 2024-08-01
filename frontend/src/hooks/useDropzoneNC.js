import { useDropzone } from 'react-dropzone'

export const useDropzoneNC = ({ onDrop, disabled }) => {
  const {acceptedFiles, getRootProps, isDragActive} = useDropzone({
    onDrop,
    disabled,
    noClick: true,
    maxFiles: 10,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg', '.png'],
      'video/mp4': ['.mp4', '.mpeg4', '.mov'] 
    } });

  return { acceptedFiles, getRootProps, isDragActive };
}