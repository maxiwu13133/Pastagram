import './index.css';

// components
import Post from '../Post';

const PostsRow = ({ chunk, username, pfp, setPosts }) => {

  return (
    <div className="postrow-container">
      { chunk.map((post, index) => 
        <Post key={ index } post={ post } username={ username } pfp={ pfp } setPosts={ setPosts } />)
      }
    </div>
  )
}

export default PostsRow;