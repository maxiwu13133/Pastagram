import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGetCommunity } from '../../hooks/useGetCommunity';
import { useFollowUser } from '../../hooks/useFollowUser';
import { useUnfollowUser } from '../../hooks/useUnfollowUser';
import { useFollowingContext } from '../../hooks/useFollowingContext';


// assets
import closeButton from '../../assets/PostView/close-button-black.png';
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


const Likes = ({ comment, reply, setLikesModal, post }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(null);

  // following context
  const { followingListGlobal, dispatch } = useFollowingContext();


  // get users info
  useEffect(() => {
    const getLikedInfo = async () => {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/comment/liked/' + comment, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        console.log('Error:', json.error);
      }
      if (response.ok) {
        setLikedUsers([...json.users.reverse()]);
        setIsLoading(false);
      }
    }

    const getLikedInfoReply = async () => {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/reply/liked/' + reply._id, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        console.log('Error:', json.error);
      }
      if (response.ok) {
        setLikedUsers([...json.users.reverse()]);
        setIsLoading(false);
      }
    }

    const getLikedInfoPost = async () => {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/post/liked/' + post._id, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
      
      if (!response.ok) {
        setIsLoading(false);
        console.log('Error:', json.error);
      }
      if (response.ok) {
        setLikedUsers([...json.users.reverse()]);
        setIsLoading(false);
      }
    }

    if (comment) {
      getLikedInfo();
    }

    if (reply) {
      getLikedInfoReply();
    }

    if (post) {
      getLikedInfoPost();
    }
  }, [comment, reply, post, user.token])


  // follow and unfollow user
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

  const handleClick = async (i) => {
    if (followingListGlobal.includes(likedUsers[i]._id)) {
      dispatch({ type: 'REMOVE_FOLLOWING', payload: likedUsers[i]._id });
      await unfollowUser({ username: user.username, targetUsername: likedUsers[i].username });
    }
    else if (!likedUsers[i].followers.includes(id)) {
      dispatch({ type: 'ADD_FOLLOWING', payload: likedUsers[i]._id });
      await followUser({ username: user.username, targetUsername: likedUsers[i].username });
    }
  }


  // user info to component list
  const createUserListItem = (i) => {
    return (
      <div className="likes-list-user" key={ i }>
        <Link to={ `/${ likedUsers[i].username }` } className="likes-list-pfp-link">
          <img 
            src={ likedUsers[i].pfp?.url ? likedUsers[i].pfp.url : defaultPfp }
            alt=""
            className="likes-list-pfp"
            draggable={ false }
          />
        </Link>

        <div className="likes-list-details">
          <Link to={ `/${ likedUsers[i].username }` } className="likes-list-username-link">
            <p className="likes-list-username">{ likedUsers[i].username }</p>
          </Link>

          <p className="likes-list-fullname">{ likedUsers[i].fullName }</p>
        </div>

        {
          likedUsers[i].username !== user.username && 
          <button 
            className={ `likes-list-follow ${ followingListGlobal.includes(likedUsers[i]._id) ? "likes-list-following" : "" }` }
            onClick={ () => handleClick(i) }
          >
            {
              followingListGlobal.includes(likedUsers[i]._id) ? 
              "Following" : "Follow"
            }
          </button>
        }
      </div>
    )
  }

  // deleted user to component list
  const createDeletedUserItem = (i) => {
    return (
      <div className="likes-list-user" key={ i }>
        <img src={ defaultPfp } alt="" className="likes-list-pfp" draggable={ false }/>

        <div className="likes-list-details">
          <p className="likes-deleted-username">
            &#91;deleted&#93;
          </p>
        </div>
      </div>
    )
  }


  return ( 
    <div className="likes-container">
      <div className="likes-overlay" onClick={ () => setLikesModal(false) } />

      <div className="likes-modal">
        <div className="likes-header">
          <p>Likes</p>

          <div className="likes-close" onClick={ () => setLikesModal(false) }>
            <img src={ closeButton } alt="" className="likes-close-icon" draggable={ false }/>
          </div>
        </div>

        <div className={ `likes-list ${ likedUsers.length === 0 ? "likes-list-empty" : "" }` }>
          {
            !isLoading && 
            likedUsers.length > 0 && 
            likedUsers.map((x, i) => x.deleted ? createDeletedUserItem(i) : createUserListItem(i))
          }
          {
            !isLoading &&
            likedUsers.length === 0 && 
            <div className="likes-empty">
              No likes yet...
            </div>
          }
        </div>
      </div>
    </div>
   );
}
 
export default Likes;