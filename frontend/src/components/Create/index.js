import { useState, useCallback } from 'react';
import './index.css';


// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useDropzoneNC } from '../../hooks/useDropzoneNC.js';
import { useAuthContext } from '../../hooks/useAuthContext.js';
import { useCreatePost } from '../../hooks/useCreatePost.js';


// components
import Preview from '../Preview';
import CloseButton from './CloseButton';


// assets
import uploadUnfocused from '../../assets/Create/upload-pic.png';
import uploadFocus from '../../assets/Create/upload-pic-blue.png';
import wrongFile from '../../assets/Create/wrong-file.png';
import ArrowLeft from './ArrowLeft';


const Create = ({ handleClick }) => {

  // Submitting files
  const [files, setFiles] = useState([]);
  const [filesSubmitted, setFilesSubmitted] = useState(false);
  const [wrongFiles, setWrongFiles] = useState(null);
  const [disableDrop, setDisableDrop] = useState(false);
  const [images, setImages] = useState([]);

  const fileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImages(currentImages => [...currentImages, reader.result]);
    }
  }

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      setWrongFiles(null);

      for (let i = 0; i < acceptedFiles.length; i++) {
        fileToBase(acceptedFiles[i]);
      }

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

  // Caption popup
  const [captionStage, setCaptionStage] = useState(false);
  const [caption, setCaption] = useState('');


  // Uploading post
  const { createPost, isLoading } = useCreatePost()
  const [postingStage, setPostingStage] = useState(false);
  const handlePost = async () => {
    setCaptionStage(false);
    setPostingStage(true);

    const response = await createPost(images, caption);
    if (response) {
      console.log("Success:", response);
    }
    
    setFiles([]);
    setImages([]);
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
                src={ isDragActiveNC ? uploadFocus : uploadUnfocused } 
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
          filesSubmitted && !wrongFiles && !postingStage &&
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
                      setCaption('');
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
                      <img src={ uploadUnfocused } alt="user" className="create-caption-pfp" />
                    </div>
                    <div className="create-caption-username">
                      { user.username }
                    </div>
                  </div>

                  <textarea 
                    className="create-caption-text" 
                    onChange={ (e) => setCaption(e.target.value) }
                    value={ caption }
                    maxLength={ 2200 }
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

        {/* Posting stage */}
        { postingStage &&
          <div className="create-posting">
            <header className="create-header">
              <p>{ isLoading ? "Sharing" : "Post shared"}</p>
            </header>
            { isLoading && 
              <div className="create-posting-loading">

              </div>
            }
            { !isLoading && 
              <div className="create-posting-finish">
                <img draggable={ false } src={ wrongFile } alt="Loading" className="create-posting-icon" />

                <p className="create-posting-text">
                  Your post has been shared.
                </p>
              </div>
            }
          </div>
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
