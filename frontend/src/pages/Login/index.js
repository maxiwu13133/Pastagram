import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

// assets
import logo from '../../assets/pintstagram-logo.png';
import phone from '../../assets/phone.png';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return(
    <div className="login-container">

      <div className="login-phone">
        <img src={ phone } alt="Phone" className="login-phone-img" />
      </div>

      <div className="login-account-options">

        <div className="login-login">

          <div className="login-logo-wrapper">
            <img src={ logo } alt="Logo" className="login-logo" />
          </div>

          <form className="login-credentials">
            <input 
              placeholder="Phone number, username, or email"
              onChange={ (e) => setEmail(e.target.value) } 
              value={ email }
            />

            <input 
              placeholder="Password"
              onChange={ (e) => setPassword(e.target.value) } 
              value={ password }
            />

            <button className="login-button">Log in</button>

            <div className="login-forgot-password">
              <Link to="/reset">Forgot password?</Link>
            </div>
          </form>

        </div>

        <div className="login-signup">
          <p>Don't have an account? { <Link to="/signup">Sign up</Link> }</p>
        </div>      

      </div>

    </div>
  );
}

export default Login;
