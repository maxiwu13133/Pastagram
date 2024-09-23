import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useGetCommunity } from '../../../../hooks/useGetCommunity';
import { useFollowUser } from '../../../../hooks/useFollowUser';
import { useUnfollowUser } from '../../../../hooks/useUnfollowUser';


// assets
import closeButton from '../../../../assets/PostView/close-button-black.png';
import defaultPfp from '../../../../assets/Profile/default-pfp.jpg';


const Likes = ({ comment, setLikesModal }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const [likedUsers, setLikedUsers] = useState([]);


  // get users info
  useEffect(() => {
    const getLikedInfo = async () => {
      const response = await fetch('http://localhost:4000/api/comment/liked/' + comment, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
      if (!response.ok) {
        console.log('Error:', json.error);
      }
      if (response.ok) {
        setLikedUsers([...json.users.reverse()]);
      }
    }

    getLikedInfo();
  }, [comment, user.token])


  // follow and unfollow user
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

  const handleClick = async (i) => {
    if (likedUsers[i].followers.includes(id)) {
      const newLikedUsers = [...likedUsers];
      newLikedUsers[i].followers = newLikedUsers[i].followers.filter(follower => follower !== id);
      setLikedUsers(newLikedUsers);
      await unfollowUser({ username: user.username, targetUsername: newLikedUsers[i].username });
    }
    else if (!likedUsers[i].followers.includes(id)) {
      const newLikedUsers = [...likedUsers];
      newLikedUsers[i].followers = newLikedUsers[i].followers.concat(id);
      setLikedUsers(newLikedUsers);
      await followUser({ username: user.username, targetUsername: newLikedUsers[i].username });
    }
  }


  // user info to component list
  const createUserListItem = (i) => {
    return (
      <div className="likes-list-user" key={ i }>
        <Link to={ `/${ likedUsers[i].username }` } className="likes-list-pfp-link">
          <img src={ likedUsers[i].pfp?.url ? likedUsers[i].pfp.url : defaultPfp } alt="" className="likes-list-pfp" />
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
            className={ `likes-list-follow ${ likedUsers[i].followers.includes(id) ? "likes-list-following" : "" }` }
            onClick={ () => handleClick(i) }
          >
            {
              likedUsers[i].followers.includes(id) ? 
              "Following" : "Follow"
            }
          </button>
        }
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
            <img src={ closeButton } alt="" className="likes-close-icon" />
          </div>
        </div>

        <div className="likes-list">
          {
            likedUsers.map((_, i) => createUserListItem(i))
          }
        </div>
      </div>
    </div>
   );
}
 
export default Likes;