import { useState } from 'react';
import './index.css';


// assets
import closeButton from '../../../../assets/PostView/close-button-black.png';


const Likes = ({ likes, setLikesModal }) => {
  const [users, setUsers] = useState({});


  return ( 
    <div className="likes-container">
      <div className="likes-overlay" onClick={ () => setLikesModal(false) } />

      <div className="likes-modal">
        <div className="likes-header">
          <p>Likes</p>

          <div className="likes-close">
            <img src={ closeButton } alt="" className="likes-close-icon" />
          </div>
        </div>

        {
          likes.length !== 0 && 
          <div className="likes-list">
            
          </div>
        }
      </div>
    </div>
   );
}
 
export default Likes;