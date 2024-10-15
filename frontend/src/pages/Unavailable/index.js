import { Link } from 'react-router-dom';
import './index.css';

const Unavailable = () => {
  return (
    <div className="unavailable-container">
      <div className="unavailable-title">
        Sorry, this page isn't available.
      </div>

      <div className="unavailable-text">
        The link you followed may be broken, or the page may have been removed. 
        <Link to="/" className="unavailable-link">Go back to Pastagram.</Link>
      </div>
    </div>
  )
}

export default Unavailable;