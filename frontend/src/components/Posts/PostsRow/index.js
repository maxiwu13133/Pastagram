import './index.css';

// components
import Post from '../Post';

const PostsRow = ({ chunk, setPosts, posts }) => {

  return (
    <div className="postrow-container">
      { chunk.map((post, index) => 
        <Post key={ index } post={ post } setPosts={ setPosts } posts={ posts }/>)
      }
    </div>
  )
}

export default PostsRow;