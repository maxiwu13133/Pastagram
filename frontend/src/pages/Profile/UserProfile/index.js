import { useState, useEffect } from 'react';
import './index.css';


// hooks
import { useGetCommunity } from '../../../hooks/useGetCommunity';
import { useGetPosts } from '../../../hooks/useGetPosts';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useFollowUser } from '../../../hooks/useFollowUser';
import { useUnfollowUser } from '../../../hooks/useUnfollowUser';
import { useDeletedContext } from '../../../hooks/useDeletedContext';
import { useFollowingContext } from '../../../hooks/useFollowingContext';
import { useNavbarContext } from '../../../hooks/useNavbarContext';


// components
import Grid from '../../../components/Posts/Grid';
import Posts from '../../../components/Posts';
import FriendsModal from '../../../components/FriendsModal';


// assets
import cameraIcon from '../../../assets/Profile/camera-icon.png';
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';
import loadSpinner from '../../../assets/EditProfile/load-spinner.svg';


// pages
import Unavailable from '../../Unavailable';


const UserProfile = ({ username }) => {
  const { user } = useAuthContext();
  const { id: selfId } = useGetCommunity({ username: user.username });
  const { id, fullName, bio, followers, following, pfp, error, isLoading } = useGetCommunity({ username });
  const { posts: p } = useGetPosts({ username });
  const [posts, setPosts] = useState([]);
  const [newFollowers, setNewFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(null);
  const { dispatch: dispatchNav } = useNavbarContext();


  // following context
  const { dispatch } = useFollowingContext();
  

  // deleted users
  const { deletedUsers } = useDeletedContext();


  // set local posts to fetched posts
  useEffect(() => {
    setPosts(p);
    dispatchNav({ type: 'SET_NAV', payload: username });
  }, [p, dispatchNav, username])


  // update following
  const { followUser, error: followError, isLoading: followIsLoading } = useFollowUser();
  const { unfollowUser, error: unfollowError, isLoading: unfollowIsLoading } = useUnfollowUser();

  const handleFollow = async () => {
    dispatch({ type: 'ADD_FOLLOWING', payload: id })
    await followUser({ username: user.username, targetUsername: username });
    setTimeout(() => {
      setNewFollowers(prevFollowers => prevFollowers + 1);
      setIsFollowing(true);
    }, 1000);
  };

  const handleUnfollow = async () => {
    dispatch({ type: 'REMOVE_FOLLOWING', payload: id })
    await unfollowUser({ username: user.username, targetUsername: username });
    setTimeout(() => {
      setNewFollowers(prevFollowers => prevFollowers - 1);
      setIsFollowing(false);
    }, 1000);
  };
  

  // update page
  useEffect(() => {
    setNewFollowers(followers.length);
    setIsFollowing(followers.includes(selfId));
  }, [followers, selfId]);


  // friends modal
  const [friendsModal, setFriendsModal] = useState(null);
  

  return ( 
    <div className="userprofile-container">
      {/* User not found */}
      {
        (deletedUsers?.includes(id) || error) && <Unavailable />
      }
      { 
        deletedUsers && 
        !isLoading &&
        !deletedUsers.includes(id) && 
        !error &&
        <>
          {/* Details */}
          <div className="userprofile-details">
            <div className="userprofile-pfp-container">
              <img draggable={ false } src={ pfp.url ? pfp.url : defaultPfp } alt="" className="userprofile-pfp" />
            </div>

            <div className="userprofile-info">
              <div className="userprofile-username">
                <h3 className="userprofile-name">{ username }</h3>

                <button 
                  className={ `userprofile-follow ${ isFollowing ? "userprofile-unfollow" : "" }` }
                  onClick={ () => isFollowing ? handleUnfollow() : handleFollow() }
                  disabled={ followIsLoading || unfollowIsLoading }
                >
                  {
                    (followIsLoading || unfollowIsLoading) ? 
                      <img src={ loadSpinner } alt="" className="userprofile-loading"/> : 
                      isFollowing ? "Unfollow" : "Follow"
                  }
                </button>

                <div className="userprofile-error">
                  { followError || unfollowError }
                </div>
              </div>

              <div className="userprofile-stats">
                <p className="userprofile-post-ct">
                  <span>{ posts.length }</span> posts
                </p>

                <p className="userprofile-follower-ct" onClick={ () => setFriendsModal("followers") }>
                  <span>{ newFollowers }</span> followers
                </p>

                <p className="userprofile-following-ct" onClick={ () => setFriendsModal("following") }>
                  <span>{ following.length }</span> following
                </p>
              </div>

              {/* friends modal */}
              {
                friendsModal &&
                <FriendsModal 
                  setFriendsModal={ setFriendsModal}
                  type={ friendsModal === "followers" ? "Followers" : "Following" }
                  username={ username }
                />
              }

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
              { posts.length > 0 && <Posts posts={ posts } username={ username } pfp={ pfp } setPosts={ setPosts } /> }
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