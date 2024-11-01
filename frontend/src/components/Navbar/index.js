import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './index.css';


// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSearchContext } from '../../hooks/useSearchContext';
import { usePfpContext } from '../../hooks/usePfpContext';
import { useNavbarContext } from '../../hooks/useNavbarContext';


// assets
import logo from '../../assets/Logos/pastagram-logo.png';
import icon from '../../assets/Logos/pastagram-icon.png';
import houseFocused from '../../assets/Navbar/ig-home-icon-focused.png';
import houseUnfocused from '../../assets/Navbar/ig-home-icon-unfocused.png';
import magnifyFocused from '../../assets/Navbar/ig-search-icon-focused.png';
import magnifyUnfocused from '../../assets/Navbar/ig-search-icon-unfocused.png';
import compassFocused from '../../assets/Navbar/ig-explore-icon-focused.png';
import compassUnfocused from '../../assets/Navbar/ig-explore-icon-unfocused.png';
import messageFocused from '../../assets/Navbar/ig-message-icon-focused.png';
import messageUnfocused from '../../assets/Navbar/ig-message-icon-unfocused.png';
// import heartFocused from '../../assets/Navbar/ig-notif-icon-focused.png';
// import heartUnfocused from '../../assets/Navbar/ig-notif-icon-unfocused.png';
import create from '../../assets/Navbar/ig-create-icon.png';
import moreFocused from '../../assets/Navbar/ig-more-icon-focused.png';
import moreUnfocused from '../../assets/Navbar/ig-more-icon-unfocused.png';
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


// components
import Create from '../Create';
import Search from '../Search';


const Navbar = () => {

  // Highlight nav
  const pathName = window.location.pathname.replace(/\//g, '');
  const { selectedNav, dispatch: dispatchNav } = useNavbarContext();
  
  useEffect(() => {
    dispatchNav({ type: 'SET_NAV', payload: pathName });
  }, [pathName, dispatchNav]);


  // Highlight more option
  const [highlightMore, setHighlightMore] = useState(false);
  const moreRef = useRef(null);


  // User context
  const { user, dispatch } = useAuthContext();
  

  // Remove More option drop down when clicked elsewhere
  const handleHighlightMore = (e) => {
    if (moreRef.current && !e.composedPath().includes(moreRef.current)) {
      setHighlightMore(false);
    };
  };


  // Open and close create modal
  const [modal, setModal] = useState(false);


  // Stop scroll when modal open
  useEffect(() => {
    if (modal) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  }, [modal])


  // open and close search modal
  const { openModal, dispatch: searchDispatch } = useSearchContext();
  const [lastNav, setLastNav] = useState('');

  const handleSearch = () => {
    if (selectedNav === 'search') {
      dispatchNav({ type: 'SET_NAV', payload: lastNav });
      searchDispatch({ type: 'CLOSE_MODAL'});
      return;
    }

    setLastNav(selectedNav);
    dispatchNav({ type: 'SET_NAV', payload: 'search' });
    searchDispatch({ type: 'OPEN_MODAL'});
  }

  
  // change nav 
  const changeNav = useCallback((nav) => {
    dispatchNav({ type: 'SET_NAV', payload: nav });
    searchDispatch({ type: 'CLOSE_MODAL'});
  }, [searchDispatch, dispatchNav]);


  // close search modal when clicked elsewhere
  const searchRef = useRef(null);
  const searchNavRef = useRef(null);

  const handleSearchModal = useCallback((e) => {
    if (
      searchRef.current &&
      openModal && 
      !e.composedPath().includes(searchRef.current) &&
      !e.composedPath().includes(searchNavRef.current)
    ) {
      changeNav(lastNav);
    }
  }, [changeNav, openModal, lastNav]);

  
  // close more option or search modal when body clicked
  useEffect(() => {
    document.body.addEventListener('click', handleHighlightMore);
    document.body.addEventListener('click', handleSearchModal);
    return () => {
      document.body.removeEventListener('click', handleHighlightMore);
      document.body.removeEventListener('click', handleSearchModal);
    };
  }, [handleSearchModal]);
  

  // Get profile picture
  const { pfp, dispatch: dispatchPfp } = usePfpContext();


  // handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    dispatchPfp({ type: 'REMOVE_PFP' });
  };

  
  return (
    <div className={ `navbar-container ${ openModal ? "navbar-collapse" : "" }` }>
      {/* Search Modal */}
      <Search ref={ searchRef }/>

      {/* Logo */}
      <div className="navbar-logo-wrapper">
        <Link to="/">
          <div className="navbar-logo">
            <img 
              draggable={ false }
              src={ icon }
              alt=""
              className={ `navbar-icon-pic ${ openModal ? "" : "navbar-icon-out" }` }
            />
            <img 
              draggable={ false }
              src={ logo }
              alt=""
              className={ `navbar-logo-pic ${ openModal ? "navbar-logo-out" : "" }` }
            />
          </div>
        </Link>
      </div>

      {/* Home */}
      <div className="navbar-option-wrapper">
        <Link to="/" onClick={ () => changeNav('') }>
          <div className={ `navbar-option navbar-home ${ selectedNav === "/" ? "navbar-highlighted" : "" }` }>
            <img 
              draggable={ false } 
              src={ selectedNav === "" ? houseFocused : houseUnfocused } 
              alt="Home" 
            />
            { !openModal && <h2>Home</h2> }
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="navbar-option-wrapper" ref={ searchNavRef }>
        <Link onClick={ () => handleSearch() }>
          <div className={ `
            navbar-option
            navbar-search
            ${ openModal ? "navbar-highlighted-search" : "" }
          ` }
          >
            <img 
              draggable={ false } 
              src={ openModal ? magnifyFocused : magnifyUnfocused } 
              alt="Search" 
            />
            { !openModal && <h2>Search</h2> }
          </div>
        </Link>
      </div>

      {/* Explore */}
      <div className="navbar-option-wrapper">
        <Link to="/explore/" onClick={ () => changeNav('explore') }>
          <div className={ `
            navbar-option
            navbar-explore
            ${ selectedNav === "explore" ? "navbar-highlighted" : "" }
          ` }>
            <img 
              draggable={ false } 
              src={ selectedNav === "explore" ? compassFocused : compassUnfocused } 
              alt="Explore" 
            />
            { !openModal && <h2>Explore</h2> }
          </div>
        </Link>
      </div>

      {/* Messages */}
      <div className="navbar-option-wrapper">
        <Link to="/messages/" onClick={ () => changeNav('messages') }>
          <div className={ `
            navbar-option 
            navbar-messages 
            ${ selectedNav === "messages" ? "navbar-highlighted" : "" }
          ` }>
            <img 
              draggable={ false } 
              src={ selectedNav === "messages" ? messageFocused : messageUnfocused }
              alt="Messages"
            />
            { !openModal && <h2>Messages</h2> }
          </div>
        </Link>
      </div>

      {/* Notifications */}
      {/* <div className="navbar-option-wrapper">
        <Link onClick={ () => changeNav('notifications') }>
          <div className={ `
            navbar-option 
            navbar-notifications 
            ${ selectedNav === "notifications" ? "navbar-highlighted" : "" }
          ` }>
            <img 
              draggable={ false } 
              src={ selectedNav === "notifications" ? heartFocused : heartUnfocused } 
              alt="Notifications" 
            />
            { !openModal && <h2>Notifications</h2> }
          </div>
        </Link>
      </div> */}

      {/* Create */}
      <div className="navbar-option-wrapper">
        <Link onClick={ () => setModal(true) }>
          <div className="navbar-option navbar-create">
            <img 
              draggable={ false } 
              src={ create } 
              alt="Create"
            />
            { !openModal && <h2>Create</h2> }
          </div>
        </Link>
      </div>

      {/* Profile */}
      <div className="navbar-option-wrapper">
        <Link to={ `/${ user.username }/`} onClick={ () => changeNav(user.username) }>
          <div className={ `
            navbar-option 
            navbar-profile 
            ${ selectedNav === user.username ? "navbar-highlighted" : "" }
          ` }>
            <img
              draggable={ false } 
              src={ pfp?.url ? pfp.url : defaultPfp } 
              alt="Profile" 
              className={ `navbar-pfp ${ selectedNav === user.username ? "navbar-pfp-highlighted" : "" }` }
            />
            { !openModal && <h2>Profile</h2> }
          </div>
        </Link>
      </div>

      {/* More */}
      <div className="navbar-option-wrapper navbar-more-wrapper">
        <div className={ `navbar-more-modal ${ highlightMore ? "" : "navbar-more-option-hide" }` }>
          <div className="navbar-more-option" onClick={ () => handleLogout() }>
            Log out
          </div>
        </div>
        <Link onClick={ () => highlightMore ? setHighlightMore(false) : setHighlightMore(true) }>
          <div 
            ref={ moreRef }
            className={ `
              navbar-option
              navbar-more
              ${ highlightMore ? "navbar-highlighted" : "" }
            ` }
          >
            <img 
              draggable={ false } 
              src={ highlightMore ? moreFocused : moreUnfocused }
              alt="More"
            />
            { !openModal && <h2>More</h2> }
          </div>
        </Link>
      </div>

      {/* Create Modal */}
      { modal && <Create handleClick={ () => setModal(false) } /> }

    </div>
  );
};

export default Navbar;
