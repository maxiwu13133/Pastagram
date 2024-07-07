import { Link } from 'react-router-dom';
import './index.css';

// assets
import logo from '../../assets/pintstagram-logo.png';
import house from '../../assets/ig-house-logo.png';
import magnify from '../../assets/ig-magnify-logo.png';
import compass from '../../assets/ig-compass-logo.png';
import message from '../../assets/ig-messages-logo.png';
import heart from '../../assets/ig-heart-logo.png';
import create from '../../assets/ig-create-logo.png';

const Navbar = () => {
  return (
    <div className="navbar-container">

      <div className="navbar-logo-wrapper">
        <Link to="/" >
          <img src={ logo } alt="Logo" className="navbar-logo"/>
        </Link>
      </div>

      <div className="navbar-option navbar-home">
        <img src={ house } alt="House" />
        <h2>Home</h2>
      </div>

      <div className="navbar-option navbar-search">
        <img src={ magnify } alt="Magnify" />
        <h2>Search</h2>
      </div>

      <div className="navbar-option navbar-explore">
        <img src={ compass } alt="Compass" />
        <h2>Explore</h2>
      </div>

      <div className="navbar-option navbar-messages">
        <img src={ message } alt="Message" />
        <h2>Messages</h2>
      </div>

      <div className="navbar-option navbar-otifications">
        <img src={ heart } alt="Heart" />
        <h2>Notifications</h2>
      </div>

      <div className="navbar-option navbar-create">
        <img src={ create } alt="Create" />
        <h2>Create</h2>
      </div>

      <div className="navbar-option navbar-profile">
        <img src={ create } alt="Profile" />
        <h2>Create</h2>
      </div>

      <div className="navbar-option navbar-more">
        <img src={ create } alt="More" />
        <h2>More</h2>
      </div>

    </div>
  );
}

export default Navbar;
