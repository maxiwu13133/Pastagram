import { useDropzone } from 'react-dropzone'

export const useDropzoneNC = () => {
  const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({ noClick: true });

  return { acceptedFiles, getRootProps, getInputProps, isDragActive };
}