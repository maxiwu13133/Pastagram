import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';

// assets
import logo from '../../assets/Logos/pastagram-logo.png';
import houseFocused from '../../assets/Navbar/ig-home-icon-focused.png';
import houseUnfocused from '../../assets/Navbar/ig-home-icon-unfocused.png';
import magnifyFocused from '../../assets/Navbar/ig-search-icon-focused.png';
import magnifyUnfocused from '../../assets/Navbar/ig-search-icon-unfocused.png';
import compassFocused from '../../assets/Navbar/ig-explore-icon-focused.png';
import compassUnfocused from '../../assets/Navbar/ig-explore-icon-unfocused.png';
import messageFocused from '../../assets/Navbar/ig-message-icon-focused.png';
import messageUnfocused from '../../assets/Navbar/ig-message-icon-unfocused.png';
import heartFocused from '../../assets/Navbar/ig-notif-icon-focused.png';
import heartUnfocused from '../../assets/Navbar/ig-notif-icon-unfocused.png';
import create from '../../assets/Navbar/ig-create-icon.png';
import moreFocused from '../../assets/Navbar/ig-more-icon-focused.png';
import moreUnfocused from '../../assets/Navbar/ig-more-icon-unfocused.png';

// components
import Create from '../Create';


const Navbar = () => {
  // Highlight nav
  const pathName = window.location.pathname.replace(/\//g,'');
  const [selectedNav, setSelectedNav] = useState(pathName);
  
  // Highlight more option
  const [highlightMore, setHighlightMore] = useState(false);
  const moreRef = useRef();

  // User context
  const { user } = useAuthContext();

  
  // Remove More option drop down when clicked elsewhere
  const handleHighlightMore = (e) => {
    if (moreRef.current && !e.composedPath().includes(moreRef.current)) {
      setHighlightMore(false);
    };
  };

  useEffect(() => {
    document.body.addEventListener('click', handleHighlightMore);
    return () => {
      document.body.removeEventListener('click', handleHighlightMore);
    };
  }, []);

  // Open and close create modal
  const [modal, setModal] = useState(false);

  // Get profile picture from localstorage
  const pfp = JSON.parse(localStorage.getItem('user')).picture;

  return (
    <div className="navbar-container">

      {/* Logo */}
      <div className="navbar-logo-wrapper">
        <Link to="/">
          <div className="navbar-logo">
            <img draggable={ false } src={ logo } alt="Logo" className="navbar-logo-pic" />
          </div>
        </Link>
      </div>

      {/* Home */}
      <div className="navbar-option-wrapper">
        <Link to="/" onClick={ () => setSelectedNav('') }>
          <div className={ `navbar-option navbar-home ${ selectedNav === "/" ? "navbar-highlighted" : "" }` }>
            <img 
              draggable={ false } 
              src={ selectedNav === "" ? houseFocused : houseUnfocused } 
              alt="Home" 
            />
            <h2>Home</h2>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="navbar-option-wrapper">
        <Link onClick={ () => setSelectedNav('search') }>
          <div className={ `navbar-option navbar-search ${ selectedNav === "search" ? "navbar-highlighted" : "" }` }>
            <img 
              draggable={ false } 
              src={ selectedNav === "search" ? magnifyFocused : magnifyUnfocused } 
              alt="Search" 
            />
            <h2>Search</h2>
          </div>
        </Link>
      </div>

      {/* Explore */}
      <div className="navbar-option-wrapper">
        <Link to="/explore/" onClick={ () => setSelectedNav('explore') }>
          <div className={ `navbar-option navbar-explore ${ selectedNav === "explore" ? "navbar-highlighted" : "" }` }>
            <img 
              draggable={ false } 
              src={ selectedNav === "explore" ? compassFocused : compassUnfocused } 
              alt="Explore" 
            />
            <h2>Explore</h2>
          </div>
        </Link>
      </div>

      {/* Messages */}
      <div className="navbar-option-wrapper">
        <Link to="/messages/" onClick={ () => setSelectedNav('messages') }>
          <div className={ `
                            navbar-option 
                            navbar-messages 
                            ${ selectedNav === "messages" ? "navbar-highlighted" : "" }` 
                          }>
            <img 
              draggable={ false } 
              src={ selectedNav === "messages" ? messageFocused : messageUnfocused }
              alt="Messages"
            />
            <h2>Messages</h2>
          </div>
        </Link>
      </div>

      {/* Notifications */}
      <div className="navbar-option-wrapper">
        <Link onClick={ () => setSelectedNav('notifications') }>
          <div className={ `
                            navbar-option 
                            navbar-notifications 
                            ${ selectedNav === "notifications" ? "navbar-highlighted" : "" }` 
                          }>
            <img 
              draggable={ false } 
              src={ selectedNav === "notifications" ? heartFocused : heartUnfocused } 
              alt="Notifications" 
            />
            <h2>Notifications</h2>
          </div>
        </Link>
      </div>

      {/* Create */}
      <div className="navbar-option-wrapper">
        <Link onClick={ () => setModal(true) }>
          <div className="navbar-option navbar-create">
            <img 
              draggable={ false } 
              src={ create } 
              alt="Create"
            />
            <h2>Create</h2>
          </div>
        </Link>
      </div>

      {/* Profile */}
      <div className="navbar-option-wrapper">
        <Link to={ `/${ user.username }/`} onClick={ () => setSelectedNav(user.username) }>
          <div className={ `
                            navbar-option 
                            navbar-profile 
                            ${ selectedNav === user.username ? "navbar-highlighted" : "" }` 
                          }>
            <img
              draggable={ false } 
              src={ pfp } 
              alt="Profile" 
              className={ `navbar-pfp ${ selectedNav === user.username ? "navbar-pfp-highlighted" : "" }` }
            />
            <h2>Profile</h2>
          </div>
        </Link>
      </div>

      {/* More */}
      <div className="navbar-option-wrapper navbar-more-wrapper">
        <Link onClick={ () => setHighlightMore(true) }>
          <div ref={ moreRef } className={ `navbar-option navbar-more ${ highlightMore ? "navbar-highlighted" : "" }` }>
            <img 
              draggable={ false } 
              src={ highlightMore ? moreFocused : moreUnfocused }
              alt="More"
            />
            <h2>More</h2>
          </div>
        </Link>
      </div>

      {/* Create Modal */}
      { modal && <Create handleClick={ () => setModal(false) } /> }

    </div>
  );
};

export default Navbar;
