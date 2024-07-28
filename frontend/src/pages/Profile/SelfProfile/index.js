import './index.css';

// assets
import pfp from '../../../assets/pintstagram-icon.png';

const SelfProfile = () => {
  return ( 
    <div className="s-profile-container">

      {/* Details */}
      <div className="s-profile-details">
        <div className="s-profile-pfp-container">
          <img src={ pfp } alt="pfp" className="s-profile-pfp" />
        </div>

        <div className="s-profile-info">
          <div className="s-profile-username">
            <h3 className="s-profile-name">maxwuw</h3>

            <button className="s-profile-edit">Edit profile</button>

            <button className="s-profile-archives">View archive</button>
          </div>

          <div className="s-profile-stats">
            <p className="s-profile-post-ct">
              <span>2</span> posts
            </p>

            <p className="s-profile-follower-ct">
              <span>131</span> followers
            </p>

            <p className="s-profile-following-ct">
              <span>118</span> following
            </p>
          </div>

          <div className="s-profile-bio">
            <p className="s-profile-full-name">Max Wu</p>

            <p className="s-profile-text">Hi this is my bio. Welcome to my page!</p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="s-profile-highlights">

      </div>

      {/* Posts */}
      <div className="s-profile-posts">

      </div>

      {/* Linkedin Resume */}
      <div className="s-profile-linkedin">
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/maximilian-wu/">Pastagram by Max Wu</a>
      </div>

    </div>
   );
};
 
export default SelfProfile;
