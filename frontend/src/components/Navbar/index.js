import { Link } from 'react-router-dom';
import './index.css';

const Navbar = () => {
  return (
    <div className="container">
      <Link to="/">
        <h1>Pintstagram</h1>
      </Link>
    </div>
  );
}

export default Navbar;
