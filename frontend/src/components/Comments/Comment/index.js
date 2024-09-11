import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';

// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';

// assets
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';

const Comments = ({ comment }) => {
  const { user } = useAuthContext();
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState({});
  const [text, setText] = useState('');
  const [likes, setLikes] = useState(0);
  const [createdAt, setCreatedAt] = useState(0);

  useEffect(() => {
    const getComments = async () => {
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
  }, []);

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
      }
    }

    if (userId !== '') {
      getUser(userId);
    }
  }, [userId])

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
    </div>
   );
}
 
export default Comments;