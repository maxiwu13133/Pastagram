import { Link } from 'react-router-dom';
import './index.css';

// assets
import logo from '../../assets/pintstagram-logo.png';
import houseFocused from '../../assets/ig-home-icon-focused.png';
import houseUnfocused from '../../assets/ig-home-icon-unfocused.png';
import magnifyFocused from '../../assets/ig-search-icon-focused.png';
import magnifyUnfocused from '../../assets/ig-search-icon-unfocused.png';
import compassFocused from '../../assets/ig-explore-icon-focused.png';
import compassUnfocused from '../../assets/ig-explore-icon-unfocused.png';
import messageFocused from '../../assets/ig-message-icon-focused.png';
import messageUnfocused from '../../assets/ig-message-icon-unfocused.png';
import heartFocused from '../../assets/ig-notif-icon-focused.png';
import heartUnfocused from '../../assets/ig-notif-icon-unfocused.png';
import create from '../../assets/ig-create-icon.png';
import moreFocused from '../../assets/ig-more-icon-focused.png';
import moreUnfocused from '../../assets/ig-more-icon-unfocused.png';


const Navbar = () => {
  return (
    <div className="navbar-container">

      <div className="navbar-logo-wrapper">
        <Link to="/">
          <div className="navbar-logo">
            <img src={ logo } alt="Logo" className="navbar-logo-pic" />
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper">
        <Link to="/">
          <div className="navbar-option navbar-home">
            <img src={ houseUnfocused } alt="Home" />
            <h2>Home</h2>
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper">
        <Link>
          <div className="navbar-option navbar-search">
            <img src={ magnifyUnfocused } alt="Search" />
            <h2>Search</h2>
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper">
        <Link to="/explore">
          <div className="navbar-option navbar-explore">
            <img src={ compassUnfocused } alt="Explore" />
            <h2>Explore</h2>
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper">
        <Link to="/messages">
          <div className="navbar-option navbar-messages">
            <img src={ messageUnfocused } alt="Messages" />
            <h2>Messages</h2>
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper">
        <Link>
          <div className="navbar-option navbar-notifications">
            <img src={ heartUnfocused } alt="Notifications" />
            <h2>Notifications</h2>
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper">
        <Link>
          <div className="navbar-option navbar-create">
            <img src={ create } alt="Create" />
            <h2>Create</h2>
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper">
        <Link to="/profile">
          <div className="navbar-option navbar-profile">
            <img src={ create } alt="Profile" />
            <h2>Profile</h2>
          </div>
        </Link>
      </div>

      <div className="navbar-option-wrapper navbar-more-wrapper">
        <Link>
          <div className="navbar-option navbar-more">
            <img src={ moreUnfocused } alt="More" />
            <h2>More</h2>
          </div>
        </Link>
      </div>

    </div>
  );
}

export default Navbar;
