import { useState } from 'react';
import './index.css';

// components
import CloseButton from '../Create/CloseButton';
import Preview from '../Preview';

// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import dots from '../../assets/PostView/three-dots.png';

// hooks
import { useDeletePost } from '../../hooks/useDeletePost';

const PostView = ({ post, closeModal, username, pfp, setPosts }) => {
  const [deletePopup, setDeletePopup] = useState(false);

  // delete post
  const { deletePost } = useDeletePost();

  const handleDelete = async () => {
    await deletePost(post);
    setPosts(posts => [...posts].filter(p => p._id !== post._id));
    setDeletePopup(false);
    closeModal();
  }

  return ( 
    <div className="postview">
      <div className="postview-overlay" onClick={ () => closeModal() } />

      <div className="postview-container">

        {/* Preview */}
        <div className="postview-preview">
          <Preview files={ post.photos } />
        </div>

        {/* Details */}
        <div className="postview-details">
          <div className="postview-header">
            <img src={ pfp ? pfp : defaultPfp } alt="" className="postview-header-icon" />

            <div className="postview-header-name">
              { username }
            </div>

            {/* Delete post */}
            { deletePopup && 
              <>
                <div className="postview-delete-overlay" onClick={ () => setDeletePopup(false) } />

                <div className="postview-delete-popup">
                  <div className="postview-delete-text">
                    <h2>Delete post?</h2>
                    <p>Are you sure you want to delete this post?</p>
                  </div>

                  <div className="postview-delete-confirm" onClick={ () => handleDelete() }>
                    Delete
                  </div>

                  <div className="postview-delete-cancel" onClick={ () => setDeletePopup(false) }>
                    Cancel
                  </div>
                </div>
              </>
            }

            <div className="postview-dots-container" onClick={ () => setDeletePopup(true) }>
              <img src={ dots } alt="" className="postview-dots" />
            </div>
          </div>

          {/* Comments */}
          <div className="postview-comments">

          </div>

          {/* Likes */}
          <div className="postview-likes">

          </div>

          {/* Write */}
          <div className="postview-write">

          </div>
        </div>
      </div>

      { !deletePopup && 
        <div className="postview-close-container" onClick={ () => closeModal() }>
          <CloseButton className="postview-close" width={ 25 } height={ 25 } />
        </div>
      }
    </div>
   );
}
 
export default PostView;