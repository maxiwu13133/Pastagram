import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { usePfpContext } from '../../hooks/usePfpContext';
import { useFollowUser } from '../../hooks/useFollowUser';
import { useUnfollowUser } from '../../hooks/useUnfollowUser';
import { useHomeLoadContext } from '../../hooks/useHomeLoadContext';
import { useNavbarContext } from '../../hooks/useNavbarContext';
import { useFollowingContext } from '../../hooks/useFollowingContext';


// assets
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


const Suggest = () => {
  const { user, dispatch } = useAuthContext();
  const { pfp, dispatch: dispatchPfp } = usePfpContext();
  const { dispatch: dispatchLoad } = useHomeLoadContext();
  const { dispatch: dispatchNav } = useNavbarContext();
  const { dispatch: dispatchFollowing } = useFollowingContext();

  // get best suggestions
  const [suggestions, setSuggestions] = useState([]);

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
        dispatchLoad({ type: 'SUGGEST_FINISH' });
      }
    };
    if (user.id) {
      getSuggestions();
    }
  }, [user.id, user.token, dispatchLoad]);


  // follow and unfollow suggestion
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

  const handleFollow = async (i) => {
    if (suggestions[i].followers.includes(user.id)) {
      const newSuggestions = [...suggestions];
      newSuggestions[i].followers = newSuggestions[i].followers.filter(follower => follower !== user.id);
      setSuggestions(newSuggestions);
      dispatchFollowing({ type: 'REMOVE_FOLLOWING', payload: suggestions[i]._id });
      await unfollowUser({ username: user.username, targetUsername: suggestions[i].username });
    }
    else if (!suggestions[i].followers.includes(user.id)) {
      const newSuggestions = [...suggestions];
      newSuggestions[i].followers = newSuggestions[i].followers.concat(user.id);
      setSuggestions(newSuggestions);
      dispatchFollowing({ type: 'ADD_FOLLOWING', payload: suggestions[i]._id });
      await followUser({ username: user.username, targetUsername: suggestions[i].username });
    };
  };


  // format suggestions
  const formatSuggestions = (suggestion, i) => {
    return (
      <div className="suggestion-container" key={ i }>
        <Link 
          to={ `/${ suggestion.username }` }
          className="suggestion-pfp-link"
          onClick={ () => dispatchNav({ type: "SET_NAV", payload: "none" }) }
        >
          <img 
            src={ suggestion.pfp?.url ? suggestion.pfp.url : defaultPfp }
            alt=""
            className="suggestion-pfp"
            draggable={ false }
          />
        </Link>

        <Link 
          to={ `/${ suggestion.username }` }
          className="suggestion-username-link"
          onClick={ () => dispatchNav({ type: "SET_NAV", payload: "none" }) }
        >
          <p className="suggestion-username">{ suggestion.username }</p>
        </Link>

        <button className="suggestion-follow" onClick={ () => handleFollow(i) }>
          {
            suggestion.followers.includes(user.id) ? "Unfollow" : "Follow"
          }
        </button>
      </div>
    )
  }


  // log out popup
  const [logoutPopup, setLogoutPopup] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    dispatchPfp({ type: 'REMOVE_PFP' });
  };


  return (
    <div className="suggest-container">
      <div className="suggest-header">
        <Link 
          to={ `/${ user.username }` }
          className="suggest-header-pfp-link"
          onClick={ () => dispatchNav({ type: "SET_NAV", payload: user.username }) }
        >
          <img src={ pfp?.url ? pfp.url : defaultPfp } alt="" className="suggest-header-pfp" draggable={ false }/>
        </Link>

        <Link 
          to={ `/${ user.username }` }
          className="suggest-header-username-link"
          onClick={ () => dispatchNav({ type: "SET_NAV", payload: user.username }) }
        >
          <p className="suggest-header-username">
            { user.username }
          </p>
        </Link>

        <button className="suggest-header-switch" onClick={ () => setLogoutPopup(true) }>
          Logout
        </button>
      </div>

      {
        logoutPopup && 
        <>
          <div className="suggest-logout-overlay" onClick={ () => setLogoutPopup(false) } />
          
          <div className="suggest-logout-container">
            <div className="suggest-logout-confirm" onClick={ () => handleLogout() }>
              Logout
            </div>

            <div className="suggest-logout-cancel" onClick={ () => setLogoutPopup(false) } >
              Cancel
            </div>
          </div>
        </>
      }
      
      {
        suggestions.length > 0 && 
        <>
          <div className="suggest-label">
            Suggested for you
          </div>

          <div className="suggest-suggestion-container">
            {
              suggestions.map((suggestion, i) => formatSuggestions(suggestion, i))
            }
          </div>
        </>
      }
      

      <div className="suggest-linkedin">
        <a
          target="_blank" 
          rel="noreferrer" 
          href="https://www.linkedin.com/in/maximilian-wu/"
        >
          Pastagram by Max Wu
        </a>
        2024
      </div>
    </div>
  )

}

export default Suggest;