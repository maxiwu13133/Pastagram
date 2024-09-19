import { useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';


// hooks
import { usePfpContext } from '../../hooks/usePfpContext';


// components
import Comment from './Comment';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


const Comments = ({ caption, comments, createdAt, username }) => {

  // newest comments first
  const reversedComments = [...comments].reverse();


  // get pfp
  const { pfp } = usePfpContext();


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
    <div className="comments-container">

      {/* No caption and comments */}
      {
        caption === "" &&
        comments.length === 0 && 
        <div className="comments-empty">
          <h2>No comments yet.</h2>
          <p>Start the conversation.</p>
        </div>
      }

      {/* Caption */}
      { 
        caption && 
        <div className="comments-caption">
          <img src={ pfp?.url ? pfp.url : defaultPfp } alt="" className="comments-caption-pfp" />

          <div className="comments-caption-details">
            <div className="comments-caption-text">
              <p><span>{ username } </span>{ caption }</p>
            </div>

            <div className="comments-caption-time">
              { formatTime(createdAt) }
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