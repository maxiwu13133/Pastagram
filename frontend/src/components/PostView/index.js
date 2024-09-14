import { useState, useEffect } from 'react';
import './index.css';

// components
import CloseButton from '../Create/CloseButton';
import Preview from '../Preview';
import Comments from '../Comments';

// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import dots from '../../assets/PostView/three-dots.png';

// hooks
import { useDeletePost } from '../../hooks/useDeletePost';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCreateComment } from '../../hooks/useCreateComment';


const PostView = ({ post, closeModal, username, pfp, setPosts }) => {
  const { user } = useAuthContext();
  const [deletePopup, setDeletePopup] = useState(false);

  // delete post
  const { deletePost } = useDeletePost();

  const handleDelete = async () => {
    await deletePost(post);
    setPosts(posts => [...posts].filter(p => p._id !== post._id));
    setDeletePopup(false);
    closeModal();
  }

  // update comments in real time
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(post.comments);
  },[post.comments])


  // create comment
  const { createComment } = useCreateComment();
  const [comment, setComment] = useState('');

  const handleCreate = async () => {
    const response = await createComment({ post, text: comment });
    setComment('');
    setComments(response.newComments);
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

            { user.username === username && 
              <div className="postview-dots-container" onClick={ () => setDeletePopup(true) }>
                <img src={ dots } alt="" className="postview-dots" />
              </div>
            }
          </div>

          {/* Comments */}
          <div className="postview-comments">
            <Comments 
              caption={ post.caption }
              comments={ comments }
              setComments={ setComments }
              createdAt={ post.createdAt }
              username={ username }
              pfp={ pfp }
            />
          </div>

          {/* Likes */}
          <div className="postview-likes">

          </div>

          {/* Write */}
          <div className="postview-write">
            <textarea 
              placeholder="Add a comment..."
              className="postview-write-text"
              onChange={ (e) => setComment(e.target.value) }
              value={ comment }
            />

            <button 
              className="postview-write-post"
              onClick={ () => handleCreate() }
              disabled={ comment.length === 0 }
            >
              Post
            </button>
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