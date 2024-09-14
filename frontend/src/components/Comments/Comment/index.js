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

const Comment = ({ comment, setIsLoading, last }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const [userId, setUserId] = useState('');
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
        setUserId(json.comment.user_id);
        setText(json.comment.text);
        setLikes(json.comment.likes);
        setCreatedAt(json.comment.createdAt);
      }
    }

    getComments();
  }, [comment, setIsLoading, user.token]);

  useEffect(() => {
    const getUser = async (userId) => {
      const response = await fetch('http://localhost:4000/api/user/' + userId, {
        method: 'GET'
      })
      const json = await response.json();

      if (!response.ok) {
        console.log('Error:', json.error);
      }
      if (response.ok) {
        setUsername(json.username);
        setPfp(json.pfp);
        
        if (last) {
          setIsLoading(false);
        }
      }
    }

    if (userId !== '') {
      getUser(userId);
    }
  }, [userId, last, setIsLoading])

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

  return ( 
    <div className="comment-container">
      <img src={ pfp.url ? pfp.url : defaultPfp } alt="" className="comment-pfp" draggable={ false } />

      <div className="comment-details">
        <div className="comment-text">
          <p><span>{ username } </span>{ text }</p>
        </div>

        <div className="comment-options">
          { formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true }) }
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