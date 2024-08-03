import { useState, useCallback } from 'react';

import './index.css';

// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useDropzoneNC } from '../../hooks/useDropzoneNC.js';

// components
import Preview from '../Preview';
import CloseButton from '../CloseButton';

// assets
import upload from '../../assets/Create/upload-pic.png';
import uploadFocus from '../../assets/Create/upload-pic-blue.png';
import wrongFile from '../../assets/Create/wrong-file.png';
import ArrowLeft from '../../components/ArrowLeft';

const Create = ({ handleClick }) => {

  // Uploading files
  const [files, setFiles] = useState([]);
  const [filesSubmitted, setFilesSubmitted] = useState(false);
  const [wrongFiles, setWrongFiles] = useState(null);
  const [disableDrop, setDisableDrop] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      setWrongFiles(null);
      setFiles(previousFiles => [
        ...previousFiles,
        ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
      ]);
      setFilesSubmitted(true);
      setDisableDrop(true);
    } else {
      setWrongFiles(rejectedFiles);
    }
  }, [])
  
  const { getRootProps } = useDropzoneC({ onDrop, disabled: disableDrop });
  const { 
    getRootProps: getRootPropsNC,
    isDragActive: isDragActiveNC
  } = useDropzoneNC({ onDrop, disabled: disableDrop });


  // Going a step back/discarding draft
  const [discardPopup, setDiscardPopup] = useState(false);

  const handleClosePost = () => {
    if (files.length === 0) {
      handleClick();
    } else {
      setDiscardPopup(true);
    };
  }

  return (
    <>
      <div className="create-overlay" onClick={ () => handleClosePost() } /> 
      <div { ...getRootPropsNC({ className: 'create-post' }) }>
        
        {/* Submit files */}
        {
          !filesSubmitted && !wrongFiles && 
          <>
            <header className="create-post-header">
              <p>Create new post</p>
            </header>
            <div className="create-post-photo">
              <img 
                className="create-post-upload" 
                draggable={ false } 
                src={ isDragActiveNC ? uploadFocus : upload } 
                alt="upload"
              />
            </div>
      
            <div className="create-post-tooltip">
              Drag photos and videos here
            </div>
            
            <button { ...getRootProps({ className: 'create-post-select-from-pc' }) }>
              Select from computer
            </button>
          </>
        }

        {/* File preview */}
        {
          filesSubmitted && !wrongFiles &&
          <>
          
            { discardPopup && 
              <>
                <div className="create-post-discard">
                  <h2>Discard post?</h2>
                  <p className="create-post-discard-tooltip">If you leave, your edits won't be saved.</p>
                  <div 
                    className="create-post-discard-confirm" 
                    onClick={ () => {
                      setFiles([]); 
                      setFilesSubmitted(false);
                      setDisableDrop(false);
                      setDiscardPopup(false);
                      } 
                    }
                  >
                    <p>Discard</p>
                  </div>
                  <div 
                    className="create-post-discard-cancel"
                    onClick={ () => setDiscardPopup(false) }
                  >
                    <p>Cancel</p>
                  </div>
                </div>
                <div className="create-post-discard-overlay" onClick={ () => setDiscardPopup(false) }></div>
              </>
            }
            <header className="create-post-preview-header">
              <div className="create-post-arrow-container" onClick={ () => setDiscardPopup(true) }>
                <ArrowLeft width={ 25 } height={ 40 } />
              </div>
              <p>Crop</p>
              <button className="create-post-preview-next">Next</button>
            </header>
            <Preview files={ files } />
          </>
        }

        {/* Wrong file submitted */}
        {
          wrongFiles &&
          <>
            <header className="create-post-header">
              <p>File couldn't be uploaded</p>
            </header>
            <div className="create-post-wrong-files">
              <img draggable={ false } src={ wrongFile } alt="Wrong files" className="create-post-wrong-icon" />

              <p className="create-post-wrong-text">This file is not supported</p>
              <p className="create-post-wrong-list"><span>{ wrongFiles[0].file.path }</span> could not be uploaded.</p>
              <button { ...getRootProps({ className: 'create-post-wrong-button' }) }>Select other files</button>
            </div>
          </>
        }
        
      </div>
      
      <div 
        className="create-close-container" onClick={ () => discardPopup ? setDiscardPopup(false) : handleClosePost() }>
        <CloseButton className="create-close" width={ 25 } height={ 25 } />
      </div>
    </>
  );
};


export default Create;
