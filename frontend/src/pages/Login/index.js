import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import './index.css';

// assets
import logo from '../../assets/pintstagram-logo.png';
import phone from '../../assets/Login/phone.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useLogin();
  const [loginAllowed, setLoginAllowed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  // Login when fields are filled out
  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setLoginAllowed(true);
    } else {
      setLoginAllowed(false);
    };
  })

  return(
    <div className="login-container">

      {/* App preview */}
      <div className="login-phone">
        <img src={ phone } alt="Phone" className="login-phone-img" />
      </div>

      <div className="login-account-options">

        {/* Login box */}
        <div className="login-login">

          <div className="login-logo-wrapper">
            <img src={ logo } alt="Logo" className="login-logo" />
          </div>

          <form className="login-credentials" onSubmit={ handleSubmit }>
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

            <button disabled={ isLoading || !loginAllowed } className="login-button">Log in</button>

            <div className="login-forgot-password">
              <Link to="/reset">Forgot password?</Link>
            </div>

            <div className="login-error-wrapper">
              { error && <div className="login-error">{ error }</div> }
            </div>

          </form>

        </div>

        {/* Signup box */}
        <div className="login-signup">
          <p>Don't have an account? { <Link to="/signup">Sign up</Link> }</p>
        </div>      

      </div>

    </div>
  );
}

export default Login;
