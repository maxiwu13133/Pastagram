import { useState, useEffect } from 'react';
import './index.css';

// assets
import multipleFiles from '../../../assets/Profile/multiple-files.png';
import chatBubble from '../../../assets/Profile/chat-bubble.png';

// components
import PostView from '../../PostView';

const Post = ({ post, username, pfp, setPosts }) => {
  const { photos, comments } = post;
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
        />
      }

      <div className="post-overlay" onClick={ () => setViewOpen(true) }>
        <img src={ chatBubble } alt="" className="post-comments" />
        <p>{ comments.length }</p>
      </div>

      { photos.length > 1 ? <img src={ multipleFiles } alt="" className="post-multiple" /> : ""}
      
      <img src={ photos[0].url } alt="Post" className="post-img" />
    </div>
   );
}
 
export default Post;