import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';

// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetCommunity } from '../../../hooks/useGetCommunity';

// assets
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';
import heartFilled from '../../../assets/PostView/heart-filled.png';
import heartHollow from '../../../assets/PostView/heart-hollow.png';

const Comment = ({ comment, setIsLoading }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState({});
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

    const data = { commentId: comment, userId: id }
    
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
    .replace('day', 'd')
    .replace('days', 'd')
    .replace('ago', '')
    .replace(/\s+/g, '');
    return shortenedTime;
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
          <p className="comment-options-likes">
            { 
              likes.length === 0 ? "" :
              likes.length === 1 ? "1 like" : `${ likes.length } likes`
            }
          </p>
        </div>
      </div>

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