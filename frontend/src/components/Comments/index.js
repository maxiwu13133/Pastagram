import { useState } from 'react';
import './index.css';

const Comments = ({ post }) => {

  return ( 
    <div className="comments-container">
      { post.caption === "" && post.comments.length === 0 && 
        <div className="comments-empty">
          <h2>No comments yet.</h2>
          <p>Start the conversation.</p>
        </div>
      }
    </div>
   );
}
 
export default Comments;