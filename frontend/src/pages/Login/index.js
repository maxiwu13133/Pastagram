import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import './index.css';

// assets
import logo from '../../assets/Logos/pastagram-logo.png';
import phone from '../../assets/Login/phone.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useLogin();
  const [loginAllowed, setLoginAllowed] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [buttonText, setButtonText] = useState('Show');

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
  }, [email.length, password.length]);


  // Highlight password input field when focused
  const passwordFocused = () => {
    setPasswordFocus(true);
  };

  const passwordNotFocused = () => {
    setPasswordFocus(false);
  }

  useEffect(() => {
    const passwordInput = document.querySelector('input[type="password"]');

    passwordInput.addEventListener('focus', passwordFocused);
    passwordInput.addEventListener('blur', passwordNotFocused);

    return () => {
      passwordInput.removeEventListener('focus', passwordFocused);
      passwordInput.removeEventListener('blur', passwordNotFocused);
    };

  },[]);


  // Show password when show button pressed
  const handleShow = () => {
    if (buttonText === 'Show') {
      setButtonText('Hide');
    } else {
      setButtonText('Show');
    };
  };


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
            <img src={ logo } alt="Pintstagram" className="login-logo" />
          </div>

          <form className="login-credentials" onSubmit={ handleSubmit }>

            <div className="login-email-input">
              <input 
                placeholder="Username or email"
                onChange={ (e) => setEmail(e.target.value) } 
                value={ email }
              />
            </div>

            <div className={ `login-password-input ${ passwordFocus === true ? "login-password-highlight" : "" }` }>
              <input 
                placeholder="Password"
                onChange={ (e) => setPassword(e.target.value) } 
                value={ password }
                type={ buttonText === "Show" ? "password" : "" }
              />

              <div className="login-password-show">
                <button type="button" onClick={ handleShow } className="login-password-show-button">
                  { password.length === 0 ? "" : buttonText }
                </button>
              </div>
            </div>

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
      
      {/* Linkedin Resume */}
      <div className="login-linkedin">
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/maximilian-wu/">Pastagram by Max Wu</a>
      </div>

    </div>
  );
}

export default Login;
