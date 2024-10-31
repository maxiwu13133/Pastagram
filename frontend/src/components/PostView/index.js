import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// components
import CloseButton from '../Create/CloseButton';
import Preview from '../Preview';
import Comments from '../Comments';
import Likes from '../Likes';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import dots from '../../assets/PostView/three-dots.png';
import chatBubble from '../../assets/PostView/chat-bubble-hollow.png';
import heartFilled from '../../assets/PostView/heart-filled.png';
import heartHollow from '../../assets/PostView/heart-hollow.png';
import closeButton from '../../assets/PostView/circle-close-black.png';
import unsavedPost from '../../assets/PostView/unsaved-post.png';
import savedPost from '../../assets/PostView/saved-post.png';


// hooks
import { useDeletePost } from '../../hooks/useDeletePost';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCreateComment } from '../../hooks/useCreateComment';
import { useLikePost } from '../../hooks/useLikePost';
import { useGetCommunity } from '../../hooks/useGetCommunity';
import { useReplyTargetContext } from '../../hooks/useReplyTargetContext';
import { useRepliesContext } from '../../hooks/useRepliesContext';
import { useCreateReply } from '../../hooks/useCreateReply';
import { useSavedAPI } from '../../hooks/useSavedAPI';
import { useNavbarContext } from '../../hooks/useNavbarContext';



const PostView = ({ post, setLocalPost, closeModal, setPosts, posts, setParentSave }) => {
  const { user } = useAuthContext();
  const { id, saved } = useGetCommunity({ username: user.username });
  const [deletePopup, setDeletePopup] = useState(false);
  const { dispatch } = useNavbarContext();

  
  // delete post
  const { deletePost } = useDeletePost();

  const handleDelete = async () => {
    await deletePost(post);
    setPosts(posts => [...posts].filter(p => p._id !== post._id));
    setDeletePopup(false);
    closeModal();
  };


  // update comments in real time
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(post.comments);
  },[post.comments]);


  // update replies in real time
  const { replies, dispatch: dispatchReplies } = useRepliesContext();


  // reply to comment
  const { commentId, replyTarget, dispatch: dispatchTarget } = useReplyTargetContext();
  const { createReply } = useCreateReply();

  const handleCreateReply = async () => {
    const response = await createReply({ commentId, text: comment });
    dispatchReplies({ type: 'SET_REPLIES', payload: replies.concat(response.reply) });
    setComment('');
  };


  // create comment
  const { createComment } = useCreateComment();
  const [comment, setComment] = useState('');

  const handleCreate = async () => {
    const response = await createComment({ post, text: comment });
    setComment('');
    if (posts) {
      const index = posts.findIndex(obj => obj._id === post._id);
      const newPosts = posts;
      newPosts[index].comments = response.newComments;
      setPosts(newPosts);
    };
    if (setLocalPost) {
      setLocalPost({
        ...post,
        comments: response.newComments
      });
    };
  };


  // post if enter button pressed as well
  const handlePost = (e) => {
    if (e.keyCode === 13 && comment.length > 0) {
      commentId ? handleCreateReply() : handleCreate();
    };
  };


  // focus text area when comment icon clicked
  const [focusTextarea, setFocusTextarea] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (focusTextarea !== null) {
      textareaRef.current.focus();
    }
  }, [focusTextarea]);


  // like post
  const { likePost } = useLikePost();
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(post.likes);
  }, [post.likes]);

  const handleLike = async () => {
    const response = await likePost({ post, user });
    if (posts) {
      const index = posts.findIndex(obj => obj._id === post._id);
      posts[index].likes = response.newPost.likes;
    }
    if (setLocalPost) {
      const newPost = post;
      newPost.likes = response.newPost.likes;
      setLocalPost(newPost);
    }
  }


  // time display
  const [date, setDate] = useState(new Date());
  const months = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ];

  useEffect(() => {
    setDate(new Date(post.createdAt));
  }, [post.createdAt]);


  // likes modal
  const [likesModal, setLikesModal] = useState(false);


  // save post
  const [localSaved, setLocalSaved] = useState([]);
  const { addSaved, removeSaved } = useSavedAPI();

  useEffect(() => {
    setLocalSaved(saved);
  }, [saved])

  const handleSave = async () => {
    if (localSaved.includes(post._id)) {
      const response = await removeSaved({ postId: post._id });
      setLocalSaved(prevSaved => prevSaved.filter(save => save !== post._id));
      const newPost = post;
      newPost.saved = response.newSaved;
      if (setLocalPost) {
        setLocalPost(newPost);
      }
      if (setParentSave) {
        setParentSave(response.newSaved);
      }
    };
    if (!localSaved.includes(post._id)) {
      const response = await addSaved({ postId: post._id });
      setLocalSaved(prevSaved => [...prevSaved, post._id]);
      const newPost = post;
      newPost.saved = response.newSaved;
      if (setLocalPost) {
        setLocalPost(newPost);
      }
      if (setParentSave) {
        setParentSave(response.newSaved);
      }
    };
  }


  // get username and pfp of poster
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState({});

  useEffect(() => {
    const getInfo = async () => {
      const response = await fetch('http://localhost:4000/api/post/info/' + post.user_id, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
      if (!response.ok) {
        console.log('Error:', json.error);
      };
      if (response.ok) {
        setUsername(json.username);
        setPfp(json.pfp);
      };
    };

    getInfo();
  }, [post, user.token]);


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
            <Link 
              to={ `/${ username }` }
              className="postview-header-icon-link"
              onClick={ () => dispatch({ type: "SET_NAV", payload: "none" }) }
            >
              <img src={ pfp?.url ? pfp.url : defaultPfp } alt="" className="postview-header-icon" draggable={ false }/>
            </Link>

            <div className="postview-header-name">
              <Link 
                to={ `/${ username }` }
                onClick={ () => dispatch({ type: "SET_NAV", payload: "none" }) }
              >
                <p className="postview-header-name-link">{ username }</p>
              </Link>
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

            { 
              user.username === username && 
              <div className="postview-dots-container" onClick={ () => setDeletePopup(true) }>
                <img src={ dots } alt="" className="postview-dots" />
              </div>
            }
          </div>

          {/* Comments */}
          <div className="postview-comments">
            <Comments 
              post={ post }
              comments={ comments }
              setComments={ setComments }
              username={ username }
              pfp={ pfp }
              setPosts={ setPosts }
              posts={ posts }
              setLocalPost={ setLocalPost }
            />
          </div>

          {/* Likes */}
          <div className="postview-likes">
            <div className="postview-likes-icons">
              <div className="postview-likes-icon-container">
                <img 
                  src={ likes.includes(id) ? heartFilled : heartHollow }
                  alt=""
                  className="postview-likes-heart"
                  onClick={ () => handleLike() }
                  draggable={ false }
                />
              </div>
              <div className="postview-likes-icon-container">
                <img 
                  src={ chatBubble }
                  alt=""
                  className="postview-likes-comment"
                  onClick={ () => focusTextarea ? setFocusTextarea(false) : setFocusTextarea(true) }
                  draggable={ false }
                />
              </div>
              <div className="postview-likes-saved-container">
                <img 
                  src={ localSaved?.includes(post._id) ?  savedPost : unsavedPost }
                  alt=""
                  className="postview-likes-saved"
                  onClick={ () => handleSave() }
                  draggable={ false }
                />
              </div>
            </div>

            <div className="postview-likes-details">
              <div className="postview-likes-cnt" onClick={ () => setLikesModal(true) }>
                { 
                  likes.length === 0 ? "Be the first to like this" : 
                  likes.length === 1 ? "1 like" : `${ likes.length } likes`
                }
              </div>
            </div>

            {/* Likes modal */}
            {
              likesModal && <Likes post={ post } setLikesModal={ setLikesModal }/>
            }

            <div className="postview-likes-time">
              <p>
                { 
                  months[date.getMonth()] + " " + date.getDate().toString() + ", " + date.getFullYear().toString()
                }
              </p>

              {
                replyTarget &&
                <div className="postview-likes-reply">
                  <div className="postview-likes-reply-target" onClick={ () => dispatchTarget({ type: 'HIGHLIGHT' }) }>
                    <p>
                      Replying to <span className="postview-likes-reply-username">{ replyTarget }</span>
                    </p>
                  </div>

                  <div 
                    className="postview-likes-reply-close"
                    onClick={ () => dispatchTarget({ type: 'REMOVE_TARGET' })
                  }>
                    <img src={ closeButton } alt="" className="postview-likes-reply-close-icon" draggable={ false } />
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Write */}
          <div className="postview-write">
            <textarea 
              placeholder="Add a comment..."
              className="postview-write-text"
              onChange={ (e) => setComment(e.target.value) }
              value={ comment }
              onKeyDown={ (e) => handlePost(e) }
              ref={ textareaRef }
              maxLength={ 500 }
            />

            <button 
              className="postview-write-post"
              onClick={ () => commentId ? handleCreateReply() : handleCreate() }
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