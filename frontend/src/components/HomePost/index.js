import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFormatTime } from '../../hooks/useFormatTime';
import { useLikePost } from '../../hooks/useLikePost';
import { useGetCommunity } from '../../hooks/useGetCommunity';


// components
import Preview from '../Preview';
import Likes from '../Likes';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import heartHollow from '../../assets/PostView/heart-hollow.png';
import heartFilled from '../../assets/PostView/heart-filled.png';
import chatBubble from '../../assets/PostView/chat-bubble-hollow.png';


const HomePost = ({ post }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });

  // get username and pfp 
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState('');

  useEffect(() => {
    const getInfo = async () => {
      const response = await fetch('http://localhost:4000/api/post/info/' + post.user_id, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
      if (!response.ok) {
        console.log('Error:', json.error);
      };
      if (response.ok) {
        setUsername(json.username);
        setPfp(json.pfp);
      };
    };

    getInfo();
  }, [user.token, post.user_id]);


  // format time display
  const { formatTime } = useFormatTime();


  // like post
  const { likePost } = useLikePost();
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(post.likes);
  }, [post]);

  const handleLikePost = async () => {
    const response = await likePost({ post, user });
    setLikes(response.newPost.likes);
  }


  // likes modal
  const [likesModal, setLikesModal] = useState(false);

  useEffect(() => {
    if (likesModal) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  }, [likesModal])


  return ( 
    <div className="homepost-container">
      <div className="homepost-header">
        <Link to={ `/${ username }` } className="homepost-header-pfp-link">
          <img src={ pfp !== '' ? pfp : defaultPfp } alt="" className="homepost-header-pfp" draggable={ false } />
        </Link>

        <Link to={ `/${ username }` }>
          <p className="homepost-header-username">{ username }</p>
        </Link>

        <div className="homepost-header-dot" />

        <p className="homepost-header-createdAt">{ formatTime(post.createdAt) }</p>
      </div>

      <div className="homepost-preview">
        <Preview files={ post.photos }/>
      </div>

      <div className="homepost-icons">
        <div className="homepost-heart-container" onClick={ () => handleLikePost() }>
          <img 
            src={ likes.includes(id) ? heartFilled : heartHollow }
            alt=""
            className="homepost-heart"
            draggable={ false }
          />
        </div>

        <div className="homepost-chat-container">
          <img src={ chatBubble } alt="" className="homepost-chat" draggable={ false } />
        </div>
      </div>

      {
        likesModal && <Likes post={ post } setLikesModal={ setLikesModal } />
      }

      <div className="homepost-likes">
        <div className="homepost-likes-cnt" onClick={ () => setLikesModal(true) }>
          { 
            likes.length === 0 ? "Be the first to like this" : 
            likes.length === 1 ? "1 like" : `${ likes.length } likes`
          }
        </div>
      </div>

      <div className="homepost-caption">
        <Link to={ `/${ username }` } className="homepost-caption-link">
          <p className="homepost-caption-username">{ username }</p>
        </Link>

        <p className="homepost-caption-text">{ post.caption }</p>
      </div>

      <div className="homepost-view-comments">

      </div>
    </div>
   );
}
 
export default HomePost;