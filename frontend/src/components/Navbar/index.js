import { Link } from 'react-router-dom';
import './index.css';

// assets
import logo from '../../assets/pintstagram-logo.png';
import house from '../../assets/ig-house-logo.png'

const Navbar = () => {
  return (
    <div className="container">
      <div className="logo-container">
        <Link to="/">
          <div className="logo-wrapper">
              <img src={ logo } alt="Logo" className="logo" />
          </div>            
        </Link>
      </div>

      <div className="nav-container">
        <Link to="/">
          <div className="nav-options">
            <img src={ house } alt="House" />
            <h2>Home</h2>
          </div>
        </Link>        
      </div>

    </div>
  );
}

export default Navbar;
