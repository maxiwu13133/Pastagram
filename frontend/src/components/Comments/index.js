import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// components
import Comment from './Comment';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


// hooks
import { useRepliesContext } from '../../hooks/useRepliesContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFormatTime } from '../../hooks/useFormatTime';


const Comments = ({ post, setLocalPost, posts, setPosts, comments, setComments, username, pfp }) => {

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
  const { formatTime } = useFormatTime();


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
          <Link to={ `/${ username }` } className="comments-pfp-link">
            <img src={ pfp?.url ? pfp.url : defaultPfp } alt="" className="comments-caption-pfp"  draggable={ false } />
          </Link>

          <div className="comments-caption-details">
            <div className="comments-caption-text">
            <p>
              <span>
                <Link to={ `/${ username }` } className="comments-text-username">{ username } </Link>
              </span>

              { post.caption }
            </p>
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
                setLocalPost={ setLocalPost }
              />
            )
          }
        </>
      }
    </div>
   );
}
 
export default Comments;