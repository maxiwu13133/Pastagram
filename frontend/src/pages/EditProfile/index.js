import { useState, useCallback, useEffect } from 'react';
import './index.css';

// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useUpdateProfile } from '../../hooks/useUpdateProfile.js';
import { useGetCommunity } from '../../hooks/useGetCommunity.js';
import { useAuthContext } from '../../hooks/useAuthContext.js';

// pages
import Loading from '../Loading';

// assets
import loadSpinner from '../../assets/EditProfile/load-spinner.svg';


const EditProfile = () => {
  const storage = JSON.parse(localStorage.getItem('user'));
  const initialPfp = storage.picture;
  const initialUsername = storage.username;

  const { user } = useAuthContext();
  const { fullName, bio, email, error, isLoading } = useGetCommunity(user);
  const [newPfp, setNewPfp] = useState(null);
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
      setNewPfp(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }));
    }
  }, []);
  const { getRootProps } = useDropzoneC({ onDrop });

  // update profile
  const { update, error: updateError, isLoading: updateIsLoading } = useUpdateProfile();

  const handleUpdate = async () => {
    await update({ 
      email: newEmail,
      fullName: newFullName,
      username: newUsername,
      bio: newBio,
      pfp: newPfp
    });
    setOldBio(newBio);
    setOldFullName(newFullName);
    setOldUsername(newUsername);
    setOldEmail(newEmail);
  }

  // set initial values
  useEffect(() => {
    setOldBio(bio);
    setOldFullName(fullName);
    setOldUsername(initialUsername);
    setOldEmail(email);
    setNewBio(oldBio);
    setNewFullName(oldFullName);
    setNewUsername(oldUsername);
    setNewEmail(oldEmail);
  }, [oldBio, oldFullName, oldUsername, oldEmail, bio, fullName, initialUsername, email]);

  return ( 
    <div className="edit-container">
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
            <img { ...getRootProps({ className: "edit-pfp-img", src: `${ newPfp ? newPfp.preview : initialPfp }` }) } alt="" />

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
                type="text"
                onChange={ (e) => setNewEmail(e.target.value) }
                value={ newEmail } 
                className="edit-field edit-email" />
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
                newPfp === null &&
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
        </>
      }
    </div>
   );
}
 
export default EditProfile;