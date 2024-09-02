import './index.css';

// hooks
import { useGetCommunity } from '../../../hooks/useGetCommunity';
import { useGetPosts } from '../../../hooks/useGetPosts';


const UserProfile = ({ username }) => {
  const { fullName, bio, followers, following, pfp, isLoading } = useGetCommunity({ username });
  const { posts } = useGetPosts({ username });
  
  return ( 
    <div className="userprofile-container">
      { !isLoading &&
        <>
          {/* Details */}
          <div className="userprofile-details">
            <div className="userprofile-pfp-container">
              <img src={ pfp.url } alt="" className="userprofile-pfp" />
            </div>

            <div className="userprofile-info">
              <div className="userprofile-username">
                <h3 className="userprofile-name">{ username }</h3>
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

          </div>
        </>
      }
    </div>
   );
}
 
export default UserProfile;