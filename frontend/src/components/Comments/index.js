import { useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';

// components
import Comment from './Comment';

// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';

const Comments = ({ post, username, pfp }) => {

  const reversedComments = [...post.comments].reverse();

  // comments loading
  const [isLoading, setIsLoading] = useState(null);

  const commentPlaceholder = (i) => {
    return <div className="comments-placeholder" key={ i } >
      <div className="comments-placeholder-pfp" />

      <div className="comments-placeholder-details">
        <div className="comments-placeholder-top" />
        <div className="comments-placeholder-bottom" />
      </div>
    </div>
  }

  return ( 
    <div className="comments-container">

      {/* No caption and comments */}
      {
        post.caption === "" && post.comments.length === 0 && 
        <div className="comments-empty">
          <h2>No comments yet.</h2>
          <p>Start the conversation.</p>
        </div>
      }

      {/* Caption */}
      { 
        post.caption && 
        <div className="comments-caption">
          <img src={ pfp ? pfp : defaultPfp } alt="" className="comments-caption-pfp" />

          <div className="comments-caption-details">
            <div className="comments-caption-text">
              <p><span>{ username } </span>{ post.caption }</p>
            </div>

            <div className="comments-caption-time">
              { formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true }) }
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
        post.comments.length > 0 &&
        
        <>
          { 
            reversedComments.map(
              (comment, i) => <Comment 
                comment={ comment }
                key={ i }
                setIsLoading={ setIsLoading }
                last={ i === reversedComments.length - 1 ? true : false }
              />
            )
          }
        </>
      }
    </div>
   );
}
 
export default Comments;