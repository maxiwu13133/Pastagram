import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavbarContext } from '../../hooks/useNavbarContext';


// pages
import Loading from '../Loading';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';
import logo from '../../assets/Logos/pastagram-icon.png';


const Explore = () => {
  const { user } = useAuthContext();
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionPosts, setSuggestionPosts] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const { dispatch } = useNavbarContext();


  useEffect(() => {
    const getSuggestions = async () => {

      const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/user/' + user.id, {
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
        setSuggestions(json.suggested);
        setSuggestionLoading(false);
      }
    };
    if (user.id) {
      getSuggestions();
      dispatch({ type: 'SET_NAV', payload: 'explore' });
    }
  }, [user.id, user.token, dispatch]);


  // get posts of suggestions
  useEffect(() => {

    const getSuggestionPosts = async () => {
      for (const suggestion of suggestions) {
        const response = await fetch('https://pastagram-backend-srn4.onrender.com/api/post/' + suggestion.username, {
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
          setSuggestionPosts(prevPosts => [...prevPosts, json.posts]);
        }
      }
      
      setPostLoading(false);
    }


    if (!suggestionLoading && suggestions.length !== 0) {
      getSuggestionPosts();
    }

    if (!suggestionLoading && suggestions.length === 0) {
      setPostLoading(false);
    }

  }, [suggestions, suggestionLoading, user]);


  // format post
  const formatPost = (post, i, username) => {
    return (
      <div className="explore-post-container" key={ i }>
        <Link 
          to={ `/${ username }` }
          className="explore-post-pic-link"
          onClick={ () => dispatch({ type: "SET_NAV", payload: "none" }) }
        >
          <img 
            src={ post.photos[0].url }
            alt=""
            className="explore-post-pic"
            draggable={ false }
          />
        </Link>
      </div>
    )
  }


  // format suggestions
  const formatSuggestions = (suggestion, i) => {
    return (
      <div className="explore-user-container" key={ i }>
        <div className="explore-user-header">
          <div className="explore-user-info">
            <Link 
              to={ `/${ suggestion.username }` }
              className="explore-user-pfp-link"
              onClick={ () => dispatch({ type: "SET_NAV", payload: "none" }) }
            >
              <img 
                src={ suggestion.pfp ? suggestion.pfp.url : defaultPfp }
                alt=""
                className="explore-user-pfp"
                draggable={ false }
              />
            </Link>

            <div className="explore-user-names">
              <Link 
                to={ `/${ suggestion.username }` }
                className="explore-user-username-link"
                onClick={ () => dispatch({ type: "SET_NAV", payload: "none" }) }
              >
                <p className="explore-user-username">{ suggestion.username }</p>
              </Link>

              <p className="explore-user-fullname">{ suggestion.fullName }</p>
            </div>
          </div>

          <div className="explore-user-stats">
            <div className="explore-user-cnt-container">
              <p className="explore-user-cnt">{ suggestionPosts[i].length }</p>
              
              <p className="explore-user-cnt-label">posts</p>
            </div>

            <div className="explore-user-cnt-container">
              <p className="explore-user-cnt">{ suggestion.followers.length }</p>
              
              <p className="explore-user-cnt-label">followers</p>
            </div>

            <div className="explore-user-cnt-container">
              <p className="explore-user-cnt">{ suggestion.following.length }</p>
              
              <p className="explore-user-cnt-label">following</p>
            </div>
          </div>
        </div>

        <div className="explore-user-posts">
          {
            [...suggestionPosts[i]].reverse().slice(0, 3).map((post, i) => formatPost(post, i, suggestion.username))
          }
        </div>
      </div>
    )
  }


  return (
    <div className="explore-container">
      {
        postLoading && <Loading />
      }
      {
        !postLoading && 
        suggestions.map((suggestion, i) => formatSuggestions(suggestion, i))
      }

      {/* no suggestions */}
      {
        !postLoading && suggestions.length === 0 &&
        <div className="explore-empty">
          <img src={ logo } alt="" className="explore-empty-icon" />

          <div className="explore-empty-title">
            Looks empty...
          </div>

          <div className="explore-empty-text">
            Follow more accounts to explore profiles.
          </div>
        </div>
      }
    </div>
  )
}

export default Explore;