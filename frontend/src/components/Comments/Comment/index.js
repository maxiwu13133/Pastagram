import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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


// components
import Likes from '../../Likes';
import Reply from '../../Reply';


const Comment = ({ post, comment, setComments, setIsLoading }) => {
  const { user } = useAuthContext();
  const { id } = useGetCommunity({ username: user.username });
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState({});
  const [postId, setPostId] = useState('');
  const [text, setText] = useState('');
  const [likes, setLikes] = useState([]);
  const [createdAt, setCreatedAt] = useState(0);
  const [replies, setReplies] = useState([]);


  // get comment info and replies
  useEffect(() => {
    const getCommentInfo = async () => {
      setIsLoading(true);
      const responseComment = await fetch('http://localhost:4000/api/comment/' + comment, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const responseReply = await fetch('http://localhost:4000/api/reply/' + comment, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const jsonComment = await responseComment.json();
      const jsonReply = await responseReply.json();

      if (!responseComment.ok || !responseReply.ok) {
        console.log('Error:', jsonComment.error, ', ', jsonReply.error);
      }

      if (responseComment.ok && responseReply.ok) {
        setPostId(jsonComment.comment.post_id);
        setText(jsonComment.comment.text);
        setLikes(jsonComment.comment.likes);
        setCreatedAt(jsonComment.comment.createdAt);
        setUsername(jsonComment.username);
        setPfp(jsonComment.pfp)
        setReplies(jsonReply.replies);
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    }

    getCommentInfo();
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
    setComments(post.comments.filter(c => c !== comment));
    post.comments = post.comments.filter(c => c !== comment);
    await deleteComment({ commentId: comment, postId: postId });
    setDeletePopup(false);
  }


  // open likes model
  const [likesModal, setLikesModal] = useState(false);


  // open replies modal
  const [replyModal, setReplyModal] = useState(false);


  return ( 
    <div className="comment-container">
      <div className="comment-comment">
        <Link to={ `/${ username }` }>
          <img src={ pfp.url ? pfp.url : defaultPfp } alt="" className="comment-pfp" draggable={ false } />
        </Link>

        <div className="comment-details">
          <div className="comment-text">
            <p>
              <span>
                <Link to={ `/${ username }` } className="comment-text-username">{ username } </Link>
              </span>

              { text }
            </p>
          </div>

          <div className="comment-options">
            <p>{ formatTime(createdAt) }</p>
            { 
              likes.length === 0 ? "" :
              <p className="comment-options-likes" onClick={ () => setLikesModal(true) }>
                {
                  likes.length === 1 ? "1 like" : `${ likes.length } likes`
                }
              </p>
            }
            <p className="comment-options-reply" >
              Reply
            </p>
            <img 
              src={ dots }
              alt=""
              className={ `comment-options-dots ${ username === user.username ? "comment-options-dots-show" : "" }` }
              onClick={ () => setDeletePopup(true) }
              draggable={ false }
            />
          </div>
        </div>

        {/* Likes modal */}
        {
          likesModal &&
          <Likes comment={ comment } setLikesModal={ setLikesModal }/>
        }

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
      
      {
        replies.length > 0 && 
        <div className="comment-replies">
          <div 
            className="comment-replies-preview"
            onClick={ () => replyModal ? setReplyModal(false) : setReplyModal(true) }
          >
            <div className="comment-replies-line" />

            <p className="comment-replies-view">
              { replyModal ? "Hide replies" : `View replies (${ replies.length })` }
            </p>
          </div>

          {
            replyModal && 
            <div className="comment-replies-list">
              {
                replies.map((_, i) => <Reply replies={ replies } key={ i } index={ i } setReplies={ setReplies } /> )
              } 
            </div>
          }
        </div>
      }
    </div>
   );
}
 
export default Comment;