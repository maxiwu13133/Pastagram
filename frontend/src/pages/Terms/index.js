import { Link } from 'react-router-dom'

import './index.css';

// assets
import icon from '../../assets/Logos/pastagram-icon.png';
import logo from '../../assets/Logos/pastagram-logo.png';

const Terms = () => {
  return ( 
    <div className="terms-container">

      <nav className="terms-header">
        <Link to="/">
          <img src={ icon } alt="Pintstagram" className="terms-icon" />
          <img src={ logo } alt="Pintstagram" className="terms-logo" />
        </Link>
      </nav>

      <div className="terms-terms-of-use">

        <div className="terms-title">
          <h1>Terms of Use</h1>
        </div>
        
        <ul>
          <li>Permissions: We do not claim ownership of your content, but you grant us permission to use it.</li>
          <li>Limitations: You can't impersonate others.</li>
          <li>Content: You can't do anything for an illegal purpose.</li>
          <li>Usage: This app is for non-commercial use. It is a personal project.</li>
        </ul>

      </div>
      
      {/* Linkedin Resume */}
      <div className="terms-linkedin">
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/maximilian-wu/">Pastagram by Max Wu</a>
      </div>

    </div>
   );
};
 
export default Terms;
