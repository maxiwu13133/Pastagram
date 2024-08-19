import './index.css';


const Post = ({ post }) => {
  const { caption, photos } = post;
  
  return ( 
    <div className="post-container">
      <div className="post-overlay">
        <img src={ photos[0] } alt="" className="post-comments" />
      </div>

      { photos.length > 0 ? <img src={ photos[0] } alt="" className="post-multiple" /> : ""}
      
      <img src={ photos[0] } alt="Post" className="post-img" />
    </div>
   );
}
 
export default Post;