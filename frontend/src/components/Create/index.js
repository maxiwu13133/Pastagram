import { useState, useEffect, useCallback } from 'react';

import './index.css';

// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useDropzoneNC } from '../../hooks/useDropzoneNC.js';

// assets
import upload from '../../assets/Create/upload-pic.png';
import uploadFocus from '../../assets/Create/upload-pic-blue.png';

const Create = () => {
  const [files, setFiles] = useState([]);
  const [filesSubmitted, setFilesSubmitted] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      console.log(file);
    });
  })
  
  const { 
          getRootProps,
        } = useDropzoneC({ onDrop });
  const { 
          getRootProps: getRootPropsNC,
          isDragActive: isDragActiveNC
        } = useDropzoneNC({ onDrop });

  return (
    <div { ...getRootPropsNC({ className: 'create-post' }) }>
      <header className="create-post-header">
        <p>Create new post</p>
      </header>

      {
        !filesSubmitted &&
        <>
          <div className="create-post-photo">
            <img className="create-post-upload" src={ isDragActiveNC ? uploadFocus : upload } alt="upload" />
          </div>
    
          <div className="create-post-tooltip">
            Drag photos and videos here
          </div>
          
          <button { ...getRootProps({ className: 'create-post-select-from-pc' }) }>
            Select from computer
          </button>
        </>
      }
      
    </div>
  );
};


export default Create;
