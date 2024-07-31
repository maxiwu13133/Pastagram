import { useDropzone } from 'react-dropzone'

export const useDropzoneNC = () => {
  const {acceptedFiles, getRootProps, isDragActive} = useDropzone({ noClick: true });

  return { acceptedFiles, getRootProps, isDragActive };
}