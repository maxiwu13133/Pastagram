import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';


// components
import Comment from './Comment';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


// hooks
import { useRepliesContext } from '../../hooks/useRepliesContext';
import { useAuthContext } from '../../hooks/useAuthContext';


const Comments = ({ post, posts, setPosts, comments, setComments, username, pfp }) => {

  // newest comments first
  const reversedComments = [...comments].reverse();


  // comments loading
  const [isLoading, setIsLoading] = useState(null);

  const commentPlaceholder = (i) => {
    return <div className="comments-placeholder" key={ i } >
      <div className={ `comments-placeholder-pfp comments-placeholder-delay-${ Math.floor(Math.random() * 3) }` } />

      <div className="comments-placeholder-details">
        <div className={ `comments-placeholder-top comments-placeholder-delay-${ Math.floor(Math.random() * 3) }` } />
        <div className={ `comments-placeholder-bot comments-placeholder-delay-${ Math.floor(Math.random() * 3) }` } />
      </div>
    </div>
  };


  // format time display
  const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    const secondsSinceCreated = new Date().getTime() - date.getTime();

    if (secondsSinceCreated / (1000 * 3600 * 24) > 7) {
      return Math.floor(secondsSinceCreated / (1000 * 3600 * 24) / 7) + 'w';
    };

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
  };


  // get all replies of comments of post
  const { user } = useAuthContext();
  const { dispatch } = useRepliesContext();

  useEffect(() => {
    const getReplies = async () => {

      const response = await fetch('http://localhost:4000/api/reply/all/' + post._id, {
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
        dispatch({ type: 'SET_REPLIES', payload: json.replies });
      };
    };

    getReplies();
  }, [user, dispatch, post]);
  


  return ( 
    <div className="comments-container">

      {/* No caption and comments */}
      {
        post.caption === "" &&
        comments.length === 0 && 
        <div className="comments-empty">
          <h2>No comments yet.</h2>
          <p>Start the conversation.</p>
        </div>
      }

      {/* Caption */}
      { 
        post.caption && 
        <div className="comments-caption">
          
          <img src={ pfp?.url ? pfp.url : defaultPfp } alt="" className="comments-caption-pfp"  draggable={ false } />

          <div className="comments-caption-details">
            <div className="comments-caption-text">
              <p><span>{ username } </span>{ post.caption }</p>
            </div>

            <div className="comments-caption-time">
              { formatTime(post.createdAt) }
            </div>
          </div>
        </div>
      }

      {/* Comments loading */}
      {
        isLoading &&
        <div className="comments-loading">
          { [...Array(20)].map((_, i) => commentPlaceholder(i)) }
        </div>
      }

      {/* Comments */}
      {
        comments.length > 0 &&
        <>
          { 
            reversedComments.map(
              (comment, i) => <Comment
                post={ post }
                comment={ comment }
                setComments={ setComments }
                key={ i }
                setIsLoading={ setIsLoading }
                last={ i === reversedComments.length - 1 ? true : false }
                setPosts={ setPosts }
                posts={ posts }
              />
            )
          }
        </>
      }
    </div>
   );
}
 
export default Comments;