import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import heartFilled from '../../assets/PostView/heart-filled.png';
import heartHollow from '../../assets/PostView/heart-hollow.png';
import dots from '../../assets/PostView/three-dots.png';
import { useGetCommunity } from '../../hooks/useGetCommunity';


const Reply = ({ replies, index, setReplies }) => {
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
      }
    }

    getUserInfo();
  }, [replies, index, user.token]);


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
  

  // delete reply popup
  const [deletePopup, setDeletePopup] = useState(false);


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
      const newReplies = replies;
      newReplies[index].likes = json.newReply.likes;
      setReplies(newReplies);
    }
  }

  return ( 
    <div className="reply-container" >
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
          <p className="reply-options-reply">
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
 
export default Reply;