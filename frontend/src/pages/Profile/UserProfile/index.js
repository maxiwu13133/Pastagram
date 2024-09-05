import './index.css';

// hooks
import { useGetCommunity } from '../../../hooks/useGetCommunity';
import { useGetPosts } from '../../../hooks/useGetPosts';

// components
import Grid from '../../../components/Posts/Grid';
import Posts from '../../../components/Posts';

// assets
import cameraIcon from '../../../assets/Profile/camera-icon.png';
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useFollowUser } from '../../../hooks/useFollowUser';
import { useUnfollowUser } from '../../../hooks/useUnfollowUser';


const UserProfile = ({ username }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const { fullName, bio, followers, following, pfp, isLoading } = useGetCommunity({ username });
  const { posts } = useGetPosts({ username });
  const { followUser, error: followError, isLoading: followIsLoading } = useFollowUser();
  const { unfollowUser, error: unfollowError, isLoading: unfollowIsLoading } = useUnfollowUser();

  const handleFollow = async () => {
    await followUser({ username: user.username, targetUsername: username });
  }

  const handleUnfollow = async () => {
    await unfollowUser({ username: user.username, targetUsername: username });
  }
  
  return ( 
    <div className="userprofile-container">
      { !isLoading &&
        <>
          {/* Details */}
          <div className="userprofile-details">
            <div className="userprofile-pfp-container">
              <img src={ pfp.url ? pfp.url : defaultPfp } alt="" className="userprofile-pfp" />
            </div>

            <div className="userprofile-info">
              <div className="userprofile-username">
                <h3 className="userprofile-name">{ username }</h3>

                <button 
                  className="userprofile-follow"
                  onClick={ () => followers.includes(id) ? handleUnfollow() : handleFollow() }
                >
                  { followers.includes(id) ? "Unfollow" : "Follow" }
                </button>
              </div>

              <div className="userprofile-stats">
                <p className="userprofile-post-ct">
                  <span>{ posts.length }</span> posts
                </p>

                <p className="userprofile-follower-ct">
                  <span>{ followers.length }</span> followers
                </p>

                <p className="userprofile-following-ct">
                  <span>{ following.length }</span> following
                </p>
              </div>

              <div className="userprofile-bio">
                <p className="userprofile-full-name">{ fullName }</p>

                <p className="userprofile-text">{ bio }</p>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="userprofile-post-container">
            <div className="userprofile-post-header"> 
              <Grid width={ 12 } height={ 17 } />
              <p>POSTS</p>
            </div>
            <div className="userprofile-posts">
              { posts.length > 0 && <Posts posts={ posts } /> }
              { posts.length === 0 && 
                <div className="userprofile-empty-posts">
                  <img src={ cameraIcon } alt="" className="userprofile-no-posts-icon" />

                  <h2 className="userprofile-no-posts">No Posts Yet</h2>
                </div> 
              }
            </div>
          </div>

          {/* Linkedin Resume */}
          <div className="userprofile-linkedin">
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
}
 
export default UserProfile;