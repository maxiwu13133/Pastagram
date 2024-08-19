import './index.css';

// components
import Post from '../Post';

const PostsRow = ({ chunk }) => {

  return (
    <div className="postrow-container">
      { chunk.map((post, index) => <Post key={ index } post={ post } />)}
    </div>
  )
}

export default PostsRow;