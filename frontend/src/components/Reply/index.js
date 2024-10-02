import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useReplyTargetContext } from '../../hooks/useReplyTargetContext';
import { useGetCommunity } from '../../hooks/useGetCommunity';
import { useDeleteReply } from '../../hooks/useDeleteReply';
import { useRepliesContext } from '../../hooks/useRepliesContext';

// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import heartFilled from '../../assets/PostView/heart-filled.png';
import heartHollow from '../../assets/PostView/heart-hollow.png';
import dots from '../../assets/PostView/three-dots.png';


// components
import Likes from '../Likes';


const Reply = ({ replies, index, replyLoading, setReplyLoading, last }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState('');


  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetch('http://localhost:4000/api/reply/user/' + replies[index].user_id, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const json = await response.json();

      if (!response.ok) {
        console.log('Error:', json.error);
      }
      
      if (response.ok) {
        setUsername(json.username);
        setPfp(json.pfp);
        if (last) {
          setReplyLoading(false);
        }
      }
    }

    getUserInfo();
  }, [replies, index, user.token, setReplyLoading, last]);


  // format time display
  const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    const secondsSinceCreated = new Date().getTime() - date.getTime();

    if (secondsSinceCreated / (1000 * 3600 * 24) > 7) {
      return Math.floor(secondsSinceCreated / (1000 * 3600 * 24) / 7) + 'w';
    }

    const formattedTime = formatDistanceToNowStrict(date, { addSuffix: true });
    const shortenedTime = formattedTime
    .replace('seconds', 's')
    .replace('second', 's')
    .replace('minutes', 'm')
    .replace('minute', 'm')
    .replace('hours', 'h')
    .replace('hour', 'h')
    .replace('days', 'd')
    .replace('day', 'd')
    .replace('ago', '')
    .replace(/\s+/g, '');
    return shortenedTime;
  }
  

  // update replies in real time
  const { replies: allReplies, dispatch: dispatchReplies } = useRepliesContext();



  // delete reply popup
  const [deletePopup, setDeletePopup] = useState(false);
  const { deleteReply } = useDeleteReply();

  const handleDelete = () => {

  }


  // show likes modal
  const [likesModal, setLikesModal] = useState(false);


  // handle likes
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(replies[index].likes);
  }, [replies, index]);
  
  const handleLike = async () => {

    const data = { replyId: replies[index]._id, userId: id };

    const response = await fetch('http://localhost:4000/api/reply/like', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      },
      body: JSON.stringify(data)
    });
    const json = await response.json();

    if (!response.ok) {
      console.log('Error:', json.error);
    }

    if (response.ok) {
      setLikes(json.newReply.likes);
      const newAllReplies = allReplies;
      const allRepliesIndex = newAllReplies.indexOf(replies[index]);
      newAllReplies[allRepliesIndex].likes = json.newReply.likes;
      dispatchReplies({ type: 'SET_REPLIES', payload: newAllReplies });
    }
  }


  // reply to comment 
  const { commentId, dispatch: dispatchTarget } = useReplyTargetContext();

  const handleReplyTarget = () => {
    if (!commentId) {
      dispatchTarget({ type: 'SET_TARGET', payload: { commentId: replies[index].comment_id, replyTarget: username } });
    };
    if (commentId === replies[index].comment_id) {
      dispatchTarget({ type: 'REMOVE_TARGET' });
    };
    if (commentId && commentId !== replies[index].comment_id) {
      dispatchTarget({ type: 'SET_TARGET', payload: { commentId: replies[index].comment_id, replyTarget: username } });
    };
  };


  return ( 
    <div className={ `reply-container ${ replyLoading ? "reply-container-hide" : "" }` } >
      <Link to={ `/${ username }` }>
        <img src={ pfp ? pfp : defaultPfp } alt="" className="reply-pfp" draggable={ false } />
      </Link>

      <div className="reply-details">
        <div className="reply-text">
          <p>
            <span>
              <Link to={ `/${ username }` } className="reply-text-username">{ username } </Link>
            </span>

            { replies[index].text }
          </p>
        </div>

        <div className="reply-options">
          <p>{ formatTime(replies[index].createdAt) }</p>
          { 
            likes.length === 0 ? "" :
            <p className="reply-options-likes" onClick={ () => setLikesModal(true) }>
              {
                likes.length === 1 ? "1 like" : `${ likes.length } likes`
              }
            </p>
          }

          <p className="reply-options-reply" onClick={ () => handleReplyTarget() }>
            Reply
          </p>
          <img 
            src={ dots }
            alt=""
            className={ `reply-options-dots ${ username === user.username ? "reply-options-dots-show" : "" }` }
            onClick={ () => setDeletePopup(true) }
            draggable={ false }
          />
        </div> 
      </div>
      
          
      {/* Likes modal */}
      {
        likesModal &&
        <Likes reply={ replies[index] } setLikesModal={ setLikesModal }/>
      }

      {/* Delete popup */}
      {
        deletePopup && 
        <>
          <div className="reply-delete-overlay" onClick={ () => setDeletePopup(false) } />

          <div className="reply-delete-popup">
            <div className="reply-delete-confirm" onClick={ () => handleDelete() }>
              Delete
            </div>

            <div className="reply-delete-cancel" onClick={ () => setDeletePopup(false) }>
              Cancel
            </div>
          </div>
        </>
      }

      <div className="reply-likes" onClick={ () => handleLike() }>
        <img 
          src={ likes.includes(id) ? heartFilled : heartHollow }
          alt=""
          className="reply-likes-icon"
          draggable={ false }
        />
      </div>
    </div>
   );
}
 
export default Reply;