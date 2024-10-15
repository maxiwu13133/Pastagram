import { useState, useCallback, useEffect } from 'react';
import './index.css';


// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useGetCommunity } from '../../hooks/useGetCommunity.js';
import { useAuthContext } from '../../hooks/useAuthContext.js';
import { useUpdate } from '../../hooks/useUpdate.js';
import { useSearchContext } from '../../hooks/useSearchContext.js';
import { useDeleteUser } from '../../hooks/useDeleteUser.js';


// pages
import Loading from '../Loading';


// assets
import loadSpinner from '../../assets/EditProfile/load-spinner.svg';
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import downArrow from '../../assets/EditProfile/down-arrow.png';


const EditProfile = () => {
  const { user, dispatch: dispatchUser } = useAuthContext();
  const { fullName, bio, email, pfp, error, isLoading } = useGetCommunity({ username: user.username });
  const [oldPfp, setOldPfp] = useState({});
  const [newPfp, setNewPfp] = useState({});
  const [pfpChanged, setPfpChanged] = useState(false);
  const [oldBio, setOldBio] = useState('');
  const [newBio, setNewBio] = useState('');
  const [oldFullName, setOldFullName] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [oldUsername, setOldUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');


  // change pfp
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setNewPfp(Object.assign(acceptedFiles[0], { url: URL.createObjectURL(acceptedFiles[0]) }));
      setPfpChanged(true);
    }
  }, []);
  const { getRootProps } = useDropzoneC({ onDrop });


  // update profile
  const { updateProfile, error: updateError, isLoading: updateIsLoading } = useUpdate();

  const handleUpdate = async () => {
    updateProfile({ 
      email: newEmail.toLowerCase(),
      fullName: newFullName,
      username: newUsername.toLowerCase().replace(/\s+/g, ''),
      bio: newBio,
      pfp: newPfp,
      pfpChanged
    });
    setOldPfp(newPfp);
    setOldBio(newBio);
    setOldFullName(newFullName);
    setOldUsername(newUsername);
    setOldEmail(newEmail);
    setPfpChanged(false);
  }

  
  // updated profile notification
  const [updatedNotif, setUpdatedNotif] = useState(false);

  useEffect(() => {
    if (updateIsLoading === false) {
      setUpdatedNotif(true);
      setTimeout(() => {
        setUpdatedNotif(false);
      }, 3000);
    }
  }, [updateIsLoading]);


  // disable submit button if no changes made since last save
  useEffect(() => {
    setOldPfp(pfp);
    setOldBio(bio);
    setOldFullName(fullName);
    setOldUsername(user.username);
    setOldEmail(email);
  }, [pfp, bio, fullName, user.username, email]);

  useEffect(() => {
    setNewPfp(oldPfp);
    setNewBio(oldBio);
    setNewFullName(oldFullName);
    setNewUsername(oldUsername);
    setNewEmail(oldEmail);
  }, [oldPfp, oldBio, oldFullName, oldUsername, oldEmail])


  // close search bar when moving to sub page
  const { dispatch } = useSearchContext();
  useEffect(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, [dispatch]);


  // delete account
  const [advancedModal, setAdvancedModal] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const { deleteUser } = useDeleteUser();
  

  const handleDelete = async () => {
    await deleteUser();
    dispatchUser({ type: 'LOGOUT' });
  }

  // Stop scroll when modal open
  useEffect(() => {
    if (deletePopup) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  }, [deletePopup])


  return ( 
    <div className={ `edit-container ${ advancedModal ? "edit-container-expand" : "" }` }>
      { isLoading && <Loading /> }
      { !isLoading &&
        <>
          {/* Profile */}
          <div className="edit-profile-container">
            <p className="edit-profile-label">
              Edit profile
            </p>
          </div>

          <div className="edit-pfp-container">
            <img 
              { ...getRootProps({ className: "edit-pfp-img", src: newPfp?.url ? newPfp.url : defaultPfp }) }
              alt=""
              draggable={ false }
            />

            <p>{ newUsername }</p>

            <button { ...getRootProps({ className: "edit-change-pfp" }) } >
              Change photo
            </button>
          </div>

          {/* Bio */}
          <div className="edit-bio-container">
            <p className="edit-bio-label">
              Bio
            </p>

            <div className="edit-bio-wrapper">
              <textarea 
                className="edit-bio" 
                onChange={ (e) => setNewBio(e.target.value) }
                value={ newBio }
                placeholder="Bio"
                maxLength={ 150 }
              />

              <div className="edit-bio-char-ct">
                { newBio.length } / 150
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div className="edit-advanced">
            <div className="edit-advanced-container">
              <p className="edit-label">
                Name
              </p>

              <input 
                name="name"
                type="text"
                onChange={ (e) => setNewFullName(e.target.value) }
                value={ newFullName } 
                className="edit-field edit-name" />
            </div>

            <div className="edit-advanced-container">
              <p className="edit-label">
                Username
              </p>

              <input 
                name="username"
                type="text"
                onChange={ (e) => setNewUsername(e.target.value) }
                value={ newUsername } 
                className="edit-field edit-username" />
            </div>
            
            <div className="edit-advanced-container">
              <p className="edit-label">
                Email
              </p>

              <input 
                name="email"
                type="text"
                onChange={ (e) => setNewEmail(e.target.value) }
                value={ newEmail } 
                className="edit-field edit-email" />
            </div>

            <div className="edit-delete-container">
              <div 
                className="edit-delete-header"
                onClick={ () => advancedModal ? setAdvancedModal(false) : setAdvancedModal(true) }
              >
                <p className="edit-delete-advanced">Advanced</p>
                
                <img 
                  src={ downArrow }
                  alt=""
                  className={ `
                    edit-delete-arrow ${ advancedModal ? "edit-delete-arrow-flip" : "edit-delete-arrow-unflip" }
                  ` }
                  draggable={ false }
                />
              </div>

              {/* advanced option */}
              <div className={ `edit-delete-option ${ advancedModal ? "edit-delete-option-show" : "" }` } >
                <h2 className="edit-delete-title">Delete account</h2>

                <button className="edit-delete-button" onClick={ () => setDeletePopup(true) }>Delete</button>
              </div>

              {/* delete popup */}
              {
                deletePopup && 
                <>
                  <div className="edit-delete-overlay" onClick={ () => setDeletePopup(false) } />

                  <div className="edit-delete-popup-container">
                    <div className="edit-delete-popup-header">
                      <h2 className="edit-delete-popup-title">Delete account</h2>
                      
                      <p className="edit-delete-popup-warning">
                        Warning: this action can not be undone.
                      </p>

                      <p className="edit-delete-popup-text">
                        Are you sure?
                      </p>
                    </div>

                    <div className="edit-delete-confirm" onClick={ () => handleDelete() }>
                      Delete
                    </div>

                    <div className="edit-delete-cancel" onClick={ () => setDeletePopup(false) }>
                      Cancel
                    </div>
                  </div>
                </>
              }
              
            </div>
          </div>

          <div className="edit-submit">
            { 
              (error && <div className="edit-error">{ error }</div>) ||
              (updateError && <div className="edit-error">{ updateError }</div>)
            }

            <button 
              className="edit-submit-button"
              onClick={ () => handleUpdate() }
              disabled={ 
                newPfp === oldPfp &&
                newBio === oldBio && 
                newFullName === oldFullName &&
                newUsername === oldUsername &&
                newEmail === oldEmail && 
                !updateIsLoading
              }
            >
              { updateIsLoading ? <img src={ loadSpinner } alt="" className="edit-submit-load" /> : "Submit"}
            </button>
          </div>
          
          {/* Profile Updated Notif */}
          <div className={ `edit-updated-notif ${ updatedNotif ? "edit-updated-notif-show" : "" }` }>
            Profile saved.
          </div>
        </>
      }
    </div>
   );
}
 
export default EditProfile;