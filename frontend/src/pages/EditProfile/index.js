import { useState, useCallback } from 'react';
import './index.css';

// hooks
import { useDropzoneC } from '../../hooks/useDropzoneC.js';
import { useUpdateProfile } from '../../hooks/useUpdateProfile.js';

// assets
import downArrow from '../../assets/Profile/down-arrow.png';

const EditProfile = () => {
  const initialPfp = JSON.parse(localStorage.getItem('user')).picture;
  const [pfp, setPfp] = useState(null);
  const [bio, setBio] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(null);
  const [fullName, setFullName] = useState('Max Wu');
  const [username, setUsername] = useState('maxwuw');
  const [email, setEmail] = useState('maxwu@gmail.com');

  // change pfp
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setPfp(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }));
    }
  }, []);
  const { getRootProps } = useDropzoneC({ onDrop });

  // update profile
  const { update, error, isLoading } = useUpdateProfile();

  const handleUpdate = async () => {
    await update({ email, fullName, username, bio, pfp });
  }

  return ( 
    <div className="edit-container">
      {/* Profile */}
      <div className="edit-profile-container">
        <p className="edit-profile-label">
          Edit profile
        </p>
      </div>

      <div className="edit-pfp-container">
        <img { ...getRootProps({ className: "edit-pfp-img", src: `${ pfp ? pfp.preview : initialPfp }` }) } alt="" />

        <p>budpeep</p>

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
            onChange={ (e) => setBio(e.target.value) }
            value={ bio }
            placeholder="Bio"
            maxLength={ 150 }
          />

          <div className="edit-bio-char-ct">
            { bio.length } / 150
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div 
        className={ `
          edit-advanced 
          ${ showAdvanced === true ? "edit-advanced-in" : "" }
          ${ showAdvanced === false ? "edit-advanced-out" : "" }
        ` } 
      >
        <div className="edit-advanced-container">
          <p className="edit-label">
            Name
          </p>

          <input 
            type="text"
            onChange={ (e) => setFullName(e.target.value) }
            value={ fullName } 
            className="edit-field edit-name" />
        </div>

        <div className="edit-advanced-container">
          <p className="edit-label">
            Username
          </p>

          <input 
            type="text"
            onChange={ (e) => setUsername(e.target.value) }
            value={ username } 
            className="edit-field edit-username" />
        </div>
        
        <div className="edit-advanced-container">
          <p className="edit-label">
            Email
          </p>

          <input 
            type="text"
            onChange={ (e) => setEmail(e.target.value) }
            value={ email } 
            className="edit-field edit-email" />
        </div>
      </div>
      
      {/* Button dropdown */}
      <div 
        className="edit-advanced-button" 
        onClick={ () => showAdvanced ? setShowAdvanced(false) : setShowAdvanced(true) }
      >
        <p>Advanced</p>
        <img 
          src={ downArrow } 
          alt="" 
          className={ `
            edit-advanced-arrow 
            ${ showAdvanced === true ? "edit-arrow-in" : "" }
            ${ showAdvanced === false ? "edit-arrow-out" : "" }
          ` } 
        />
      </div>

      <div className="edit-submit">
        <button className="edit-submit-button" onClick={ () => handleUpdate() }>
          Submit
        </button>
      </div>
    </div>
   );
}
 
export default EditProfile;