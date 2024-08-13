import { useState, useCallback } from 'react';
import './index.css';


// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useDropzoneNC } from '../../hooks/useDropzoneNC.js';
import { useAuthContext } from '../../hooks/useAuthContext.js';


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

  // Profile username
  const { user } = useAuthContext();

  // Input next button
  const [captionStage, setCaptionStage] = useState(false);
  const [caption, setCaption] = useState('');

  const handlePost = () => {
    console.log(caption);
  }

  return (
    <>
      <div className="create-overlay" onClick={ () => handleClosePost() } /> 
      <div { ...getRootPropsNC({ className: `create-post ${ captionStage ? "create-with-caption" : "" }` }) }>
        
        {/* Submit files */}
        {
          !filesSubmitted && !wrongFiles && 
          <>
            <header className="create-header">
              <p>Create new post</p>
            </header>
            <div className="create-photo">
              <img 
                className="create-upload" 
                draggable={ false } 
                src={ isDragActiveNC ? uploadFocus : upload } 
                alt="upload"
              />
            </div>
      
            <div className="create-tooltip">
              Drag photos and videos here
            </div>
            
            <button { ...getRootProps({ className: 'create-select-from-pc' }) }>
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
                <div className="create-discard">
                  <h2>Discard post?</h2>
                  <p className="create-discard-tooltip">If you leave, your edits won't be saved.</p>
                  <div 
                    className="create-discard-confirm" 
                    onClick={ () => {
                      setFiles([]); 
                      setFilesSubmitted(false);
                      setDisableDrop(false);
                      setDiscardPopup(false);
                      setCaptionStage(false);
                      } 
                    }
                  >
                    <p>Discard</p>
                  </div>
                  <div 
                    className="create-discard-cancel"
                    onClick={ () => setDiscardPopup(false) }
                  >
                    <p>Cancel</p>
                  </div>
                </div>
                <div className="create-discard-overlay" onClick={ () => setDiscardPopup(false) }></div>
              </>
            }
            <header className="create-preview-header">
              <div 
                className="create-arrow-container" 
                onClick={ () => captionStage ? setCaptionStage(false) : setDiscardPopup(true) }
              >
                <ArrowLeft width={ 25 } height={ 40 } />
              </div>
              <p>Create new post</p>
              <button 
                className="create-preview-next"
                onClick={ () => captionStage ? handlePost() : setCaptionStage(true) }
              >
                { captionStage ? "Share" : "Next" }
              </button>
            </header>
            <div className="create-preview-caption">
              <Preview files={ files } />

              { captionStage && 
                <div className="create-caption">
                  <div className="create-caption-user">
                    <div className="create-caption-pfp-container">
                      <img src={ upload } alt="user" className="create-caption-pfp" />
                    </div>
                    <div className="create-caption-username">
                      { user.username }
                    </div>
                  </div>

                  <textarea 
                    className="create-caption-text" 
                    onChange={ (e) => setCaption(e.target.value) }
                    value={ caption }
                    maxlength={ 2200 }
                  />
                  <div className="create-caption-char-ct">
                    <div className="create-caption-char-ct-text">
                      { caption.length }/2,200
                    </div>
                  </div>
                </div>
              }
            </div>
          </>
        }

        {/* Wrong file submitted */}
        {
          wrongFiles &&
          <>
            <header className="create-header">
              <p>File couldn't be uploaded</p>
            </header>
            <div className="create-wrong-files">
              <img draggable={ false } src={ wrongFile } alt="Wrong files" className="create-wrong-icon" />

              <p className="create-wrong-text">This file is not supported</p>
              <p className="create-wrong-list"><span>{ wrongFiles[0].file.path }</span> could not be uploaded.</p>
              <button { ...getRootProps({ className: 'create-wrong-button' }) }>Select other files</button>
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
