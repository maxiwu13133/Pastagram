import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// pages
import Loading from '../../Loading'


// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetCommunity } from '../../../hooks/useGetCommunity';
import { useGetPosts } from '../../../hooks/useGetPosts';
import { usePfpContext } from '../../../hooks/usePfpContext';
import { useGetSaved } from '../../../hooks/useGetSaved';
import { useDeletedContext } from '../../../hooks/useDeletedContext';
import { useProfileLoadContext } from '../../../hooks/useProfileLoadContext';


// components
import Grid from '../../../components/Posts/Grid';
import Posts from '../../../components/Posts';
import Create from '../../../components/Create';
import FriendsModal from '../../../components/FriendsModal';


// assets
import cameraIcon from '../../../assets/Profile/camera-icon.png';
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';
import unsavedPost from '../../../assets/PostView/unsaved-post.png';
import savedEmpty from '../../../assets/Profile/save-empty.png'


const SelfProfile = () => {
  const { user } = useAuthContext();
  const { pfp } = usePfpContext();
  const { fullName, bio, followers, following, error, isLoading } = useGetCommunity({ username: user.username });
  const { posts: p, error: postError,  isLoading: postLoading } = useGetPosts({ username: user.username });
  const [posts, setPosts] = useState([]);
  const [postsUpdating, setPostsUpdating] = useState(null);
  const [deletedNotif, setDeletedNotif] = useState(false);


  // render page when everything is loaded
  const { postLoad, savedLoad, dispatch } = useProfileLoadContext();
  const [profileLoad, setProfileLoad] = useState(false);

  useEffect(() => {
    if (postLoad && savedLoad) {
      setProfileLoad(true);
    }
  }, [postLoad, savedLoad, dispatch]);


  // deleted users
  const { deletedUsers } = useDeletedContext();


  // update posts
  useEffect(() => {
    if (p.length !== 0) {
      setPostsUpdating(true)
      setPosts(p);
      setPostsUpdating(false);
      dispatch({ type: 'POST_FINISH' });
    }
    if (p.length === 0) {
      dispatch({ type: 'POST_FINISH' });
    }
  }, [p, dispatch]);


  // deleted post notif
  useEffect(() => {
    if (posts.length !== p.length && postsUpdating === false) {
      setDeletedNotif(true);
      setTimeout(() => {
        setDeletedNotif(false);
      }, 3000);
    }
  }, [posts, p.length, postsUpdating]);


  // create modal
  const [modal, setModal] = useState(false);


  // select post tab
  const [savedTab, setSavedTab] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const { saved } = useGetSaved();

  useEffect(() => {
    setSavedPosts(saved.filter(x => !deletedUsers.includes(x.user_id)));
    dispatch({ type: 'SAVED_FINISH' });
  }, [saved, deletedUsers, dispatch]);

  
  // friends modal
  const [friendsModal, setFriendsModal] = useState(null);

  
  return (
    <div className="s-profile-container">

      { (followers === null || posts === null) ? <Loading /> : "" }

      {
        !profileLoad && 
        isLoading &&
        postLoading && 
        <div className="s-profile-load">
          <Loading />
        </div>
      }
      { 
        !isLoading && !postLoading && 
        <>
          {/* Details */}
          <div className="s-profile-details">
            <div className="s-profile-pfp-container">
              <img draggable={ false } src={ pfp?.url ? pfp.url : defaultPfp } alt="pfp" className="s-profile-pfp" />
            </div>

            <div className="s-profile-info">
              <div className="s-profile-username">
                <h3 className="s-profile-name">{ user.username }</h3>

                <Link to="/account/edit/">
                  <button className="s-profile-edit" >Edit profile</button>
                </Link>

              </div>

              { 
                !error && 
                <div className="s-profile-stats">
                  <p className="s-profile-post-ct">
                    <span>{ posts.length }</span> posts
                  </p>

                  <p className="s-profile-follower-ct" onClick={ () => setFriendsModal("followers") }>
                    <span>{ followers.length }</span> followers
                  </p>

                  <p className="s-profile-following-ct" onClick={ () => setFriendsModal("following") }>
                    <span>{ following.length }</span> following
                  </p>
                </div>
              }

              {/* friends modal */}
              {
                friendsModal && 
                <FriendsModal 
                  setFriendsModal={ setFriendsModal }
                  type={ friendsModal === "followers" ? "Followers" : "Following" }
                  followers={ followers }
                  following={ following }
                />
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
              <div 
                className={ `s-profile-post-posts ${ savedTab ? "" : "s-profile-post-header-selected" }` }
                onClick={ () => setSavedTab(false) }
              >
                <Grid width={ 12 } height={ 17 } />
                <p>POSTS</p>
              </div>

              <div 
                className={ `s-profile-post-saved ${ savedTab ? "s-profile-post-header-selected" : "" }` }
                onClick={ () => setSavedTab(true) }
              >
                <img src={ unsavedPost } alt="" className="s-profile-post-saved-icon" draggable={ false }/>
                <p>SAVED</p>
              </div>
            </div>

            <div className="s-profile-posts">

              {/* posts */}
              { 
                posts.length > 0 && !savedTab && 
                <Posts posts={ posts } setPosts={ setPosts } />
              }

              {/* empty posts */}
              { 
                posts.length === 0 && !savedTab && 
                <div className="s-profile-empty-posts">
                  <Link className="s-profile-create-icon-container" onClick={ () => setModal(true) }>
                    <img src={ cameraIcon } alt="" className="s-profile-share-icon" draggable={ false }/>
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

              {/* saved posts */}
              {
                savedTab && savedPosts.length > 0 && 
                <Posts posts={ savedPosts } />
              }

              {/* empty saved posts */}
              {
                savedTab && savedPosts.length === 0 && 
                <div className="s-profile-saved-empty">
                  <img src={ savedEmpty } alt="" className="s-profile-saved-empty-icon" draggable={ false }/>

                  <h2>Save</h2>

                  <p>
                    Save photos that you want to see again. No one is notified, and only you can see what you've saved.
                  </p>
                </div>
              }
            </div>
          </div>

          {/* Deleted Notif */}
          <div className={ `s-profile-deleted-notif ${ deletedNotif ? "s-profile-deleted-notif-show" : "" }` }>
            Post deleted.
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
