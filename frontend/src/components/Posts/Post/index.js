import { useState, useEffect } from 'react';
import './index.css';

// assets
import multipleFiles from '../../../assets/Profile/multiple-files.png';
import chatBubble from '../../../assets/Profile/chat-bubble.png';
import heartWhite from '../../../assets/Profile/heart-white.png';

// components
import PostView from '../../PostView';

const Post = ({ post, username, pfp, setPosts, posts }) => {
  const { photos, comments, likes } = post;
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    if (viewOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  }, [viewOpen])

  return ( 
    <div className="post-container">

      { viewOpen && 
        <PostView 
          post={ post }
          closeModal={ () => setViewOpen(false) }
          username={ username }
          pfp={ pfp }
          setPosts={ setPosts }
          posts={ posts }
        />
      }

      <div className="post-overlay" onClick={ () => setViewOpen(true) }>
        <img src={ heartWhite } alt="" className={ `post-likes ${ likes.length === 0 ? 'remove' : '' }` } />
        <p className={ `post-likes-length ${ likes.length === 0 ? 'remove' : '' }` }>{ likes.length }</p>

        <img src={ chatBubble } alt="" className="post-comments" />
        <p>{ comments.length }</p>
      </div>

      { photos.length > 1 ? <img src={ multipleFiles } alt="" className="post-multiple" /> : ""}
      
      <img src={ photos[0].url } alt="Post" className="post-img" />
    </div>
   );
}
 
export default Post;