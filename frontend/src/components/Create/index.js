import {useEffect } from 'react';

import './index.css';

// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useDropzoneNC } from '../../hooks/useDropzoneNC.js';

// assets
import upload from '../../assets/Create/upload-pic.png';
import uploadFocus from '../../assets/Create/upload-pic-blue.png';

const Create = () => {
  const { 
          acceptedFiles,
          getRootProps,
        } = useDropzoneC();
  const { 
          acceptedFiles: acceptedFilesNC,
          getRootProps: getRootPropsNC,
          isDragActive: isDragActiveNC
        } = useDropzoneNC();

  useEffect(() => {
    
  }, [acceptedFiles, acceptedFilesNC]);

  return (
    <div className="create-post" { ...getRootPropsNC() }>
      <header className="create-post-header">
        <p>Create new post</p>
      </header>

      <div className="create-post-photo">
        <img className="create-post-upload" src={ isDragActiveNC ? uploadFocus : upload } alt="upload" />
      </div>

      <div className="create-post-tooltip">
        Drag photos and videos here
      </div>
      
      <button className="create-post-select-from-pc" { ...getRootProps() }>
        Select from computer
      </button>
      
    </div>
  );
};


export default Create;
