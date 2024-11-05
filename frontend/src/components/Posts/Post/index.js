import { useState, useEffect } from 'react';
import { AsyncImage } from 'loadable-image';
import { Fade } from 'transitions-kit';
import './index.css';


// assets
import multipleFiles from '../../../assets/Profile/multiple-files.png';
import chatBubble from '../../../assets/Profile/chat-bubble.png';
import heartWhite from '../../../assets/Profile/heart-white.png';


// components
import PostView from '../../PostView';


// context
import { ReplyTargetContextProvider } from '../../../context/ReplyTargetContext';
import { RepliesContextProvider } from '../../../context/RepliesContext';


const Post = ({ post, setPosts, posts }) => {
  const { photos, comments, likes } = post;
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    if (viewOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  }, [viewOpen])


  // make https
  const makeHttps = (link) => {
    if (link[4] !== 's') {
      return link.slice(0, 4) + 's' + link.slice(4);
    }
    return link;
  }


  return ( 
    <div className="post-container">

      { viewOpen &&
        <RepliesContextProvider>
          <ReplyTargetContextProvider>
            <PostView 
              post={ post }
              closeModal={ () => setViewOpen(false) }
              setPosts={ setPosts }
              posts={ posts }
            />
          </ReplyTargetContextProvider>
        </RepliesContextProvider>
      }

      <div className="post-overlay" onClick={ () => setViewOpen(true) }>
        <img src={ heartWhite } alt="" className={ `post-likes ${ likes.length === 0 ? 'remove' : '' }` } />
        <p className={ `post-likes-length ${ likes.length === 0 ? 'remove' : '' }` }>{ likes.length }</p>

        <img src={ chatBubble } alt="" className="post-comments" />
        <p>{ comments.length }</p>
      </div>

      { photos.length > 1 ? <img src={ multipleFiles } alt="" className="post-multiple" /> : ""}

      <AsyncImage
        alt=""
        src={ makeHttps(photos[0].url) } 
        Transition={ Fade }
        loader={ <div style={{ background: '#888' }} /> }
        draggable={ false }
        className="post-img"
        timeout={ 200 }
      />
    </div>
   );
}
 
export default Post;