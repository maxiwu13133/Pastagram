import './index.css';

// assets
import multipleFiles from '../../../assets/Profile/multiple-files.png';
import chatBubble from '../../../assets/Profile/chat-bubble.png';

const Post = ({ post }) => {
  const { photos, comments } = post;
  
  return ( 
    <div className="post-container">
      <div className="post-overlay">
        <img src={ chatBubble } alt="" className="post-comments" />
        <p>{ comments.length }</p>
      </div>

      { photos.length > 1 ? <img src={ multipleFiles } alt="" className="post-multiple" /> : ""}
      
      <img src={ photos[0] } alt="Post" className="post-img" />
    </div>
   );
}
 
export default Post;