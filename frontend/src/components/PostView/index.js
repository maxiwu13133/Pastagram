import { useState, useEffect } from 'react';
import './index.css';

// components
import CloseButton from '../Create/CloseButton';
import Preview from '../Preview';

const PostView = ({ post, closeModal }) => {

  return ( 
    <div className="postview">
      <div className="postview-overlay" onClick={ () => closeModal() } />

      <div className="postview-container">
        <div className="postview-preview">
          <Preview files={ post.photos } />
        </div>

        <div className="postview-details">
          <div className="postview-name">
            
          </div>
        </div>
      </div>

      <div className="postview-close-container" onClick={ () => closeModal() }>
        <CloseButton className="postview-close" width={ 25 } height={ 25 } />
      </div>
    </div>
   );
}
 
export default PostView;