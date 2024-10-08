import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useGetCommunity } from '../../hooks/useGetCommunity';
import { usePfpContext } from '../../hooks/usePfpContext';
import { useFollowUser } from '../../hooks/useFollowUser';
import { useUnfollowUser } from '../../hooks/useUnfollowUser';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';

const Suggest = () => {
  const { user } = useAuthContext();
  const { pfp } = usePfpContext();
  const { id } = useGetCommunity({ username: user.username });

  // get best suggestions
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const getSuggestions = async () => {
      const response = await fetch('http://localhost:4000/api/user/' + id, {
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
      }
    };
    if (id) {
      getSuggestions();
    }
  }, [id, user.token]);


  // follow and unfollow suggestion
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

  const handleFollow = async (i) => {
    if (suggestions[i].followers.includes(id)) {
      const newSuggestions = [...suggestions];
      newSuggestions[i].followers = newSuggestions[i].followers.filter(follower => follower !== id);
      setSuggestions(newSuggestions);
      await unfollowUser({ username: user.username, targetUsername: suggestions[i].username });
    }
    else if (!suggestions[i].followers.includes(id)) {
      const newSuggestions = [...suggestions];
      newSuggestions[i].followers = newSuggestions[i].followers.concat(id);
      setSuggestions(newSuggestions);
      await followUser({ username: user.username, targetUsername: suggestions[i].username });
    };
  };


  // format suggestions
  const formatSuggestions = (suggestion, i) => {
    return (
      <div className="suggestion-container" key={ i }>
        <Link to={ `/${ suggestion.username }` } className="suggestion-pfp-link">
          <img 
            src={ suggestion.pfp?.url ? suggestion.pfp.url : defaultPfp }
            alt=""
            className="suggestion-pfp"
            draggable={ false }
          />
        </Link>

        <Link to={ `/${ suggestion.username }` } className="suggestion-username-link">
          <p className="suggestion-username">{ suggestion.username }</p>
        </Link>

        <button className="suggestion-follow" onClick={ () => handleFollow(i) }>
          {
            suggestion.followers.includes(id) ? "Unfollow" : "Follow"
          }
        </button>
      </div>
    )
  }


  return (
    <div className="suggest-container">
      <div className="suggest-header">
        <Link to={ `/${ user.username }` } className="suggest-header-pfp-link">
          <img src={ pfp.url } alt="" className="suggest-header-pfp" draggable={ false }/>
        </Link>

        <Link to={ `/${ user.username }` } className="suggest-header-username-link">
          <p className="suggest-header-username">
            { user.username }
          </p>
        </Link>

        <button className="suggest-header-switch">
          Switch
        </button>
      </div>

      <div className="suggest-label">
        Suggested for you
      </div>

      <div className="suggest-suggestion-container">
        {
          suggestions.map((suggestion, i) => formatSuggestions(suggestion, i))
        }
      </div>

      <div className="suggest-linkedin">
        <a
          target="_blank" 
          rel="noreferrer" 
          href="https://www.linkedin.com/in/maximilian-wu/"
        >
          Pastagram by Max Wu
        </a>
        
      </div>
    </div>
  )

}

export default Suggest;