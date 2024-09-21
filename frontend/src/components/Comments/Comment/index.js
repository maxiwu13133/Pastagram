import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';

// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetCommunity } from '../../../hooks/useGetCommunity';
import { useDeleteComment } from '../../../hooks/useDeleteComment';


// assets
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';
import heartFilled from '../../../assets/PostView/heart-filled.png';
import heartHollow from '../../../assets/PostView/heart-hollow.png';
import dots from '../../../assets/PostView/three-dots.png';


const Comment = ({ comment, setIsLoading }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState({});
  const [postId, setPostId] = useState('');
  const [text, setText] = useState('');
  const [likes, setLikes] = useState([]);
  const [createdAt, setCreatedAt] = useState(0);


  // get comment info
  useEffect(() => {
    const getComments = async () => {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/comment/' + comment, {
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
        setPostId(json.comment.post_id);
        setText(json.comment.text);
        setLikes(json.comment.likes);
        setCreatedAt(json.comment.createdAt);
        setUsername(json.username);
        setPfp(json.pfp);
        setIsLoading(false);
      }
    }

    getComments();
  }, [comment, setIsLoading, user.token]);


  // handle like and unliking comment
  const handleLike = async () => {

    const data = { commentId: comment, userId: id };
    
    const response = await fetch('http://localhost:4000/api/comment/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      },
      body: JSON.stringify(data)
    })
    const json = await response.json();

    if (!response.ok) {
      console.log('Error:', json.error);
    }
    if (response.ok) {
      setLikes(json.newComment.likes);
    }
  }


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

  
  // delete comment
  const [deletePopup, setDeletePopup] = useState(false);
  const { deleteComment } = useDeleteComment();

  const handleDelete = async () => {
    await deleteComment({ commentId: comment, postId: postId });
  }

  return ( 
    <div className="comment-container">
      <img src={ pfp.url ? pfp.url : defaultPfp } alt="" className="comment-pfp" draggable={ false } />

      <div className="comment-details">
        <div className="comment-text">
          <p><span>{ username } </span>{ text }</p>
        </div>

        <div className="comment-options">
          <p>{ formatTime(createdAt) }</p>
          { 
            likes.length === 0 ? "" :
            <p className="comment-options-likes">
              {
                likes.length === 1 ? "1 like" : `${ likes.length } likes`
              }
            </p>
          }
          <p className="comment-options-reply">
            Reply
          </p>
          <img 
            src={ dots }
            alt=""
            className={ `comment-options-dots ${ username === user.username ? "comment-options-dots-show" : "" }` }
            onClick={ () => setDeletePopup(true) }
          />
        </div>
      </div>

      {/* Delete popup */}
      {
        deletePopup && 
        <>
          <div className="comment-delete-overlay" onClick={ () => setDeletePopup(false) } />

          <div className="comment-delete-popup">
            <div className="comment-delete-confirm" onClick={ () => handleDelete() }>
              Delete
            </div>

            <div className="comment-delete-cancel" onClick={ () => setDeletePopup(false) }>
              Cancel
            </div>
          </div>
        </>
      }

      <div className="comment-likes" onClick={ () => handleLike() }>
        <img 
          src={ likes.includes(id) ? heartFilled : heartHollow }
          alt=""
          className="comment-likes-icon"
          draggable={ false }
        />
      </div>
    </div>
   );
}
 
export default Comment;