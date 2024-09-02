import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

// pages
import Loading from '../../Loading'

// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetCommunity } from '../../../hooks/useGetCommunity';
import { useGetPosts } from '../../../hooks/useGetPosts';

// components
import Grid from '../../../components/Posts/Grid';
import Posts from '../../../components/Posts';
import Create from '../../../components/Create';

// assets
import cameraIcon from '../../../assets/Profile/camera-icon.png';
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';

const SelfProfile = () => {
  const { user } = useAuthContext();
  const { fullName, bio, followers, following, pfp, error, isLoading } = useGetCommunity(user);
  const { posts, error: postError,  isLoading: postLoading } = useGetPosts(user.username);

  // create modal
  const [modal, setModal] = useState(false);
  
  return (
    <div className="s-profile-container">

      { (followers === null || posts === null) ? <Loading /> : "" }

      { 
        !isLoading && !postLoading && 
        <>
          {/* Details */}
          <div className="s-profile-details">
            <div className="s-profile-pfp-container">
              <img draggable={ false } src={ pfp.url ? pfp.url : defaultPfp } alt="pfp" className="s-profile-pfp" />
            </div>

            <div className="s-profile-info">
              <div className="s-profile-username">
                <h3 className="s-profile-name">{ user.username }</h3>

                <Link to="/account/edit/">
                  <button className="s-profile-edit" >Edit profile</button>
                </Link>

                <button className="s-profile-archives">View archive</button>
              </div>

              { !error && 
                <div className="s-profile-stats">
                  <p className="s-profile-post-ct">
                    <span>{ posts.length }</span> posts
                  </p>

                  <p className="s-profile-follower-ct">
                    <span>{ followers.length }</span> followers
                  </p>

                  <p className="s-profile-following-ct">
                    <span>{ following.length }</span> following
                  </p>
                </div>
              }

              { (error && <div>{ error }</div>) || (postError && <div>{ postError }</div>) }

              <div className="s-profile-bio">
                <p className="s-profile-full-name">{ fullName }</p>

                <p className="s-profile-text">{ bio }</p>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="s-profile-post-container">
              <div className="s-profile-post-header">
                <Grid width={ 12 } height={ 17 } />
                <p>POSTS</p>
              </div>
              <div className="s-profile-posts">
                { posts.length > 0 && <Posts posts={ posts} /> }
                { posts.length === 0 && 
                  <div className="s-profile-empty-posts">
                    <Link className="s-profile-create-icon-container" onClick={ () => setModal(true) }>
                      <img src={ cameraIcon } alt="" className="s-profile-share-icon" />
                    </Link>

                    <h2 className="s-profile-share-title">Share Photos</h2>

                    <div className="s-profile-share-text">
                      When you share photos, they will appear on your profile.
                    </div>

                    <button className="s-profile-share-create" onClick={ () => setModal(true) }>
                      Share your first photo
                    </button>

                    {/* Create Modal */}
                    { modal && <Create handleClick={ () => setModal(false) } /> }
                  </div> 
                }
              </div>
          </div>

          {/* Linkedin Resume */}
          <div className="s-profile-linkedin">
            <a 
              target="_blank" 
              rel="noreferrer" 
              href="https://www.linkedin.com/in/maximilian-wu/"
            >
              Pastagram by Max Wu
            </a>
          </div>
        </>
      }

    </div>
   );
};
 
export default SelfProfile;
