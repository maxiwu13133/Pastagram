import { useState, useEffect, useCallback } from 'react';

import './index.css';

// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useDropzoneNC } from '../../hooks/useDropzoneNC.js';

// assets
import upload from '../../assets/Create/upload-pic.png';
import uploadFocus from '../../assets/Create/upload-pic-blue.png';
import wrongFile from '../../assets/Create/wrong-file.png';

const Create = () => {
  const [files, setFiles] = useState([]);
  const [filesSubmitted, setFilesSubmitted] = useState(false);
  const [wrongFiles, setWrongFiles] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
    } else {
      setWrongFiles(rejectedFiles);
    }
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
        <p>{ wrongFiles ? "File couldn't be uploaded" : "Create new post" }</p>
      </header>

      {
        !filesSubmitted && !wrongFiles && 
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
      {
        filesSubmitted && !wrongFiles && 
        <div className="create-post-preview">

        </div>
      }
      {
        wrongFiles && 
        <div className="create-post-wrong-files">
          <img src={ wrongFile } alt="Wrong files" className="create-post-wrong-icon" />

          <p className="create-post-wrong-text">This file is not supported</p>
          <p className="create-post-wrong-list"><span>{ wrongFiles[0].file.path }</span> could not be uploaded.</p>
          <button className="create-post-wrong-button">Select other files</button>
        </div>
      }
      
    </div>
  );
};


export default Create;
