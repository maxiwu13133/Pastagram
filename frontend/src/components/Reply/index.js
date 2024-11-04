import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useReplyTargetContext } from '../../hooks/useReplyTargetContext';
import { useDeleteReply } from '../../hooks/useDeleteReply';
import { useRepliesContext } from '../../hooks/useRepliesContext';
import { useFormatTime } from '../../hooks/useFormatTime';
import { useNavbarContext } from '../../hooks/useNavbarContext';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import heartFilled from '../../assets/PostView/heart-filled.png';
import heartHollow from '../../assets/PostView/heart-hollow.png';
import dots from '../../assets/PostView/three-dots.png';


// components
import Likes from '../Likes';


const Reply = ({ replies, index, replyLoading, setReplyLoading, last, setCommentReplies }) => {
  const { user } = useAuthContext();
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState('');
  const [deleted, setDeleted] = useState(false);
  const { dispatch } = useNavbarContext();


  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/reply/user/' + replies[index].user_id, {
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
        setDeleted(json.deleted);
        if (last) {
          setTimeout(() => {
            setReplyLoading(false);
          }, 50);
        };
      };
    }

    getUserInfo();
  }, [replies, index, user.token, setReplyLoading, last]);


  // format time display
  const { formatTime } = useFormatTime();
  

  // update replies in real time
  const { replies: allReplies, dispatch: dispatchReplies } = useRepliesContext();


  // delete reply popup
  const [deletePopup, setDeletePopup] = useState(false);
  const { deleteReply } = useDeleteReply();

  const handleDelete = () => {
    deleteReply({ replyId: replies[index]._id });
    const replyIndex = allReplies.indexOf(replies[index]);
    const newReplies = allReplies;
    newReplies.splice(replyIndex, 1);
    dispatchReplies({ type: 'SET_REPLIES', payload: newReplies });

    setCommentReplies(prevReplies => prevReplies.filter(reply => reply !== replies[index]));
    setDeletePopup(false);
  }


  // show likes modal
  const [likesModal, setLikesModal] = useState(false);


  // handle likes
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(replies[index].likes);
  }, [replies, index]);
  
  const handleLike = async () => {

    const data = { replyId: replies[index]._id, userId: user.id };

    const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/reply/like', {
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
      dispatchTarget({ 
        type: 'SET_TARGET', 
        payload: { commentId: replies[index].comment_id, replyTarget: deleted ? '[deleted]' : username }
      });
    };
    if (commentId === replies[index].comment_id) {
      dispatchTarget({ type: 'REMOVE_TARGET' });
    };
    if (commentId && commentId !== replies[index].comment_id) {
      dispatchTarget({
        type: 'SET_TARGET',
        payload: { commentId: replies[index].comment_id, replyTarget: deleted ? '[deleted]' : username }
      });
    };
  };


  return ( 
    <div className={ `reply-container ${ replyLoading ? "reply-container-hide" : "" }` } >
      {
        deleted && <img src={ defaultPfp } alt="" className="reply-pfp" />
      }
      {
        !deleted && 
        <Link 
          to={ `/${ username }` }
          className="reply-pfp-link"
          onClick={ () => dispatch({ type: "SET_NAV", payload: username }) }
        >
          <img src={ pfp ? pfp : defaultPfp } alt="" className="reply-pfp" draggable={ false } />
        </Link>
      }

      <div className="reply-details">
        <div className="reply-text">
          <p>
            {
              deleted && 
              <span className="reply-deleted-username">&#91;deleted&#93; </span>
            }
            {
              !deleted && 
              <span>
                <Link 
                  to={ `/${ username }` }
                  className="reply-text-username"
                  onClick={ () => dispatch({ type: "SET_NAV", payload: username }) }
                >{ username } </Link>
              </span>
            }

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
            className={ `
              reply-options-dots 
              ${ username === user.username ? "reply-options-dots-show" : "" }
              ${ user.id === replies[index].user_id ? "reply-options-dots-show" : "" }
            ` }
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

      {
        !deleted && 
        <div className="reply-likes">
          <img 
            src={ likes.includes(user.id) ? heartFilled : heartHollow }
            alt=""
            className="reply-likes-icon"
            draggable={ false }
            onClick={ () => handleLike() }
          />
        </div>
      }
    </div>
   );
}
 
export default Reply;