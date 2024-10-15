import './index.css';


// assets
import closeButton from '../../assets/PostView/close-button-black.png';
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


const FriendsModal = ({ setFriendsModal, type, followers, following }) => {



  return (
    <div>
      <div className="friends-overlay" onClick={ () => setFriendsModal(false) } />

      <div className="friends-container">
        <div className="friends-header">
          <p className="friends-title">
            { type }
          </p>

          <div className="friends-close">
            <img src={ closeButton } alt="" className="friends-close-icon" draggable={ false }/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendsModal;