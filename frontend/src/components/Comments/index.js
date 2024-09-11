import { formatDistanceToNowStrict } from 'date-fns';
import './index.css';

// hooks
import { useGetComments } from '../../hooks/useGetComments';

// components
import Comment from './Comment';


const Comments = ({ post, username, pfp }) => {

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
          <img src={ pfp } alt="" className="comments-caption-pfp" />

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

      {/* Comments */}
      {
        post.comments.length > 0 && 
        
        <>
          { post.comments.map((comment, i) => <Comment comment={ comment } key={ i } />) }
        </>
      }
    </div>
   );
}
 
export default Comments;