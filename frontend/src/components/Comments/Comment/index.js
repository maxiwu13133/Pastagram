import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';


// hooks
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetCommunity } from '../../../hooks/useGetCommunity';
import { useDeleteComment } from '../../../hooks/useDeleteComment';
import { useReplyTargetContext } from '../../../hooks/useReplyTargetContext';
import { useRepliesContext } from '../../../hooks/useRepliesContext';


// assets
import defaultPfp from '../../../assets/Profile/default-pfp.jpg';
import heartFilled from '../../../assets/PostView/heart-filled.png';
import heartHollow from '../../../assets/PostView/heart-hollow.png';
import dots from '../../../assets/PostView/three-dots.png';
import loadSpinner from '../../../assets/EditProfile/load-spinner.svg';


// components
import Likes from '../../Likes';
import Reply from '../../Reply';


const Comment = ({ post, posts, setPosts, comment, setComments, setIsLoading, last }) => {
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
    const getCommentInfo = async () => {
      setIsLoading(true);
      const responseComment = await fetch('http://localhost:4000/api/comment/' + comment, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      })
      const jsonComment = await responseComment.json();

      if (!responseComment.ok) {
        console.log('Error:', jsonComment.error);
      }

      if (responseComment.ok) {
        setPostId(jsonComment.comment.post_id);
        setText(jsonComment.comment.text);
        setLikes(jsonComment.comment.likes);
        setCreatedAt(jsonComment.comment.createdAt);
        setUsername(jsonComment.username);
        setPfp(jsonComment.pfp)
        if (last) {
          setIsLoading(false);
        }
      }
    }

    getCommentInfo();
  }, [comment, setIsLoading, user.token, last]);


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
    const index = posts.indexOf(post);
    const newPosts = posts;
    newPosts[index].comments = post.comments.filter(c => c !== comment);
    setPosts(newPosts);
    await deleteComment({ commentId: comment, postId: postId });
    setDeletePopup(false);
  }


  // open likes model
  const [likesModal, setLikesModal] = useState(false);


  // open replies modal
  const [replyModal, setReplyModal] = useState(false);


  // replies loading
  const [replyLoading, setReplyLoading] = useState(false);

  const handleReplyLoad = () => {
    setReplyLoading(true);
    setReplyModal(true);
  };


  // replies context
  const { replies } = useRepliesContext();
  const [commentReplies, setCommentReplies] = useState([]);

  useEffect(() => {
    const filteredReplies = [];
    for (const index in replies) {
      if (replies[index].comment_id === comment) {
        filteredReplies.push(replies[index]);
      };
      console.log(index, ': ', replies[index]);
    };
    setCommentReplies(filteredReplies);
  }, [replies, comment])


  // reply to comment
  const { commentId, flash, dispatch } = useReplyTargetContext();

  const handleReply = () => {
    if (!commentId) {
      dispatch({ type: 'SET_TARGET', payload: { commentId: comment, replyTarget: username } });
    };
    if (commentId === comment) {
      dispatch({ type: 'REMOVE_TARGET' });
    };
    if (commentId && commentId !== comment) {
      dispatch({ type: 'SET_TARGET', payload: { commentId: comment, replyTarget: username } });
    };
  };


  // highlight comment briefly
  const [highlight, setHighlight] = useState(null);

  useEffect(() => {
    if (flash === true || flash === false) {
      setHighlight(true);
      setTimeout(() => {
        setHighlight(false);
      }, 1000);
    }
  }, [flash]);


  return ( 
    <div className={ `
      comment-container
      ${ commentId === comment ? "comment-container-reply" : "" }
      ${ highlight && commentId === comment ? "comment-container-highlight" : "" }
    ` }>
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
            <p className="comment-options-reply" onClick={ () => handleReply() } >
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
        commentReplies.length > 0 && 
        <div className="comment-replies">
          <div 
            className="comment-replies-preview"
            onClick={ () => replyModal ? setReplyModal(false) : handleReplyLoad(true) }
          >
            <div className="comment-replies-line" />

            <p className="comment-replies-view">
              { replyModal && !replyLoading ? "Hide replies" : `View replies (${ commentReplies.length })` }
            </p>

            {
              replyLoading && 
              <div className="comment-replies-loading">
                <img src={ loadSpinner } alt="" className="comment-replies-loading-icon" />
              </div>
            }
          </div>

          {
            replyModal &&
            <div className="comment-replies-list">
              {
                commentReplies.map((_, i) => 
                  <Reply 
                    replies={ commentReplies }
                    key={ i }
                    index={ i }
                    replyLoading={ replyLoading }
                    setReplyLoading={ setReplyLoading }
                    last={ i === commentReplies.length - 1 ? true : false }
                  />
                )
              } 
            </div>
          }
        </div>
      }
    </div>
   );
}
 
export default Comment;