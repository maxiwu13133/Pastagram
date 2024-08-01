import { useDropzone } from 'react-dropzone'

export const useDropzoneC = ({ onDrop }) => {
  const {acceptedFiles, getRootProps, isDragActive} = useDropzone({
    onDrop,
    maxFiles: 10,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mpeg4', '.mov']
    } });

  return { acceptedFiles, getRootProps, isDragActive };
}
