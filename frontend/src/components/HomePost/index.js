import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFormatTime } from '../../hooks/useFormatTime';
import { useLikePost } from '../../hooks/useLikePost';
import { useCreateComment } from '../../hooks/useCreateComment';
import { useSavedAPI } from '../../hooks/useSavedAPI';
import { useNavbarContext } from '../../hooks/useNavbarContext';


// components
import Preview from '../Preview';
import Likes from '../Likes';
import PostView from '../PostView';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import heartHollow from '../../assets/PostView/heart-hollow.png';
import heartFilled from '../../assets/PostView/heart-filled.png';
import chatBubble from '../../assets/PostView/chat-bubble-hollow.png';
import unsavedPost from '../../assets/PostView/unsaved-post.png';
import savedPost from '../../assets/PostView/saved-post.png';


// context
import { RepliesContextProvider } from '../../context/RepliesContext';
import { ReplyTargetContextProvider } from '../../context/ReplyTargetContext';


const HomePost = ({ post, saved, last, posterInfo }) => {
  const { user } = useAuthContext();
  const { dispatch: dispatchNav } = useNavbarContext();

  // set local post for real time updating
  const [localPost, setLocalPost] = useState({});

  useEffect(() => {
    setLocalPost(post);
  }, [post]);


  // format time display
  const { formatTime } = useFormatTime();


  // like post
  const { likePost } = useLikePost();
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(post.likes);
  }, [post]);

  const handleLikePost = async () => {
    const response = await likePost({ post, user });
    setLikes(response.newPost.likes);
  }


  // likes modal
  const [likesModal, setLikesModal] = useState(false);


  // postview modal
  const [postViewModal, setPostViewModal] = useState(false);


  // stop body scroll when modal open
  useEffect(() => {
    if (likesModal || postViewModal) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    };
  }, [likesModal, postViewModal]);


  // handle textarea
  const { createComment } = useCreateComment();
  const [comment, setComment] = useState('');

  const handleCreate = async () => {
    const response = await createComment({ post, text: comment });
    setComment('');
    const newLocalPost = localPost;
    newLocalPost.comments = response.newComments;
    setLocalPost(newLocalPost);
  };

  const handlePost = (e) => {
    if (e.keyCode === 13 && comment.length > 0) {
      handleCreate()
    };
  }


  // save post
  const { addSaved, removeSaved } = useSavedAPI();
  const [localSaved, setLocalSaved] = useState([]);

  useEffect(() => {
    setLocalSaved(saved);
  }, [saved]);

  const handleSave = async () => {
    if (localSaved.includes(post._id)) {
      const response = await removeSaved({ postId: post._id });
      setLocalSaved(response.newSaved);
    };

    if (!localSaved.includes(post._id)) {
      const response = await addSaved({ postId: post._id });
      setLocalSaved(response.newSaved);
    };
  }


  return ( 
    <div className="homepost-container">
      <div className="homepost-header">
        <Link 
          to={ `/${ posterInfo[post.user_id].username }` }
          className="homepost-header-pfp-link"
          onClick={ () => dispatchNav({ type: "SET_NAV", payload: "none" }) }
        >
          <img 
            src={ posterInfo[post.user_id].pfp.url ? posterInfo[post.user_id].pfp.url : defaultPfp } 
            alt="" 
            className="homepost-header-pfp" 
            draggable={ false } 
          />
        </Link>

        <Link
          to={ `/${ posterInfo[post.user_id].username }` }
          className="homepost-header-username-link"
          onClick={ () => dispatchNav({ type: "SET_NAV", payload: "none" }) }
        >
          <p className="homepost-header-username">{ posterInfo[post.user_id].username }</p>
        </Link>

        <div className="homepost-header-dot" />

        <p className="homepost-header-createdAt">{ formatTime(post.createdAt) }</p>
      </div>

      <div className="homepost-preview">
        <Preview files={ post.photos } home={ true }/>
      </div>

      <div className="homepost-icons">
        <div className="homepost-heart-container" onClick={ () => handleLikePost() }>
          <img 
            src={ likes.includes(user.id) ? heartFilled : heartHollow }
            alt=""
            className="homepost-heart"
            draggable={ false }
          />
        </div>

        <div className="homepost-chat-container" onClick={ () => setPostViewModal(true) }>
          <img 
            src={ chatBubble }
            alt=""
            className="homepost-chat"
            draggable={ false }
          />
        </div>

        <div className="homepost-saved-container" onClick={ () => handleSave() }>
          <img 
            src={ localSaved.includes(post._id) ? savedPost : unsavedPost }
            alt=""
            className="homepost-saved"
            draggable={ false }
          />
        </div>
      </div>

      {
        likesModal && <Likes post={ post } setLikesModal={ setLikesModal } />
      }

      <div className="homepost-likes">
        <div className="homepost-likes-cnt" onClick={ () => setLikesModal(true) }>
          { 
            likes.length === 0 ? "Be the first to like this" : 
            likes.length === 1 ? "1 like" : `${ likes.length } likes`
          }
        </div>
      </div>

      <div className="homepost-caption">
        <p>
          <Link
            to={ `/${ posterInfo[post.user_id].username }` }
            className="homepost-caption-link"
            onClick={ () => dispatchNav({ type: "SET_NAV", payload: "none" }) }
          >
            { posterInfo[post.user_id].username }
          </Link>

          <span className="homepost-caption-text">{ post.caption }</span>
        </p>

      </div>

      {
        postViewModal && 
        <RepliesContextProvider>
          <ReplyTargetContextProvider>
            <PostView 
              post={ localPost }
              setLocalPost={ setLocalPost }
              closeModal={ setPostViewModal }
              username={ posterInfo[post.user_id].username }
              pfp={ posterInfo[post.user_id].pfp }
              setParentSave={ setLocalSaved }
            />
          </ReplyTargetContextProvider>
        </RepliesContextProvider>
      }

      {
        post.comments.length > 0 && 
        <div className="homepost-comments-container">
          <p 
            onClick={ () => setPostViewModal(true) }
            className="homepost-comments-text"
          >
            { `View all ${ localPost.comments?.length } comments` }
          </p>
        </div>
      }

      <div className="homepost-write">
        <textarea 
          className="homepost-write-text"
          placeholder="Add a comment..."
          onChange={ (e) => setComment(e.target.value) }
          value={ comment }
          onKeyDown={ (e) => handlePost(e) }
          rows={ 1 }
          maxLength={ 500 }
        />

        <button 
          className={ `homepost-post ${ comment.length === 0 ? "homepost-post-hide" : "" }` }
          onClick={ () => handleCreate() }
        >
          Post
        </button>
      </div>
    </div>
   );
}
 
export default HomePost;