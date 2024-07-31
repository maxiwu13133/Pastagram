import { useDropzone } from 'react-dropzone'

export const useDropzoneC = () => {
  const {acceptedFiles, getRootProps, isDragActive} = useDropzone();

  return { acceptedFiles, getRootProps, isDragActive };
}
