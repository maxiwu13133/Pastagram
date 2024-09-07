import './index.css';

// components
import PostsRow from './PostsRow';

const Posts = ({ posts, username, pfp, setPosts }) => {

  const reversedPosts = [...posts].reverse();
  
  // segment posts into rows of 3 posts
  const getPostChunks = (posts) => {
    const chunks = []
    for (let i = 0; i < posts.length; i += 3) {
      const chunk = posts.slice(i, i + 3);
      chunks.push(chunk);
    }
    return chunks;
  }
  const postChunks = getPostChunks(reversedPosts);

  
  return (
    <div className="posts-container">
      { postChunks.map((chunk, index) => 
        <PostsRow key={ index } chunk={ chunk } username={ username } pfp={ pfp } setPosts={ setPosts } />)
      }
    </div>
  )

}

export default Posts;