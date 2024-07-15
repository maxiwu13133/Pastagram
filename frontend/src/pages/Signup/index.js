import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../../hooks/useSignup';
import './index.css';

// assets
import logo from '../../assets/pastagram-logo.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error } = useSignup();
  const [signupAllowed, setSignupAllowed] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [buttonText, setButtonText] = useState('Show');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, fullName, password);
  };

  // Login when fields are filled out
  useEffect(() => {
    if (email.length > 0 && fullName.length > 0 && password.length > 0) {
      setSignupAllowed(true);
    } else {
      setSignupAllowed(false);
    };
  }, [email.length, fullName.length, password.length]);


  // Highlight password input field when focused
  const passwordFocused = () => {
    setPasswordFocus(true);
  };

  const passwordNotFocused = () => {
    setPasswordFocus(false);
  }

  useEffect(() => {
    const passwordInput = document.querySelector("input[type='password']");

    passwordInput.addEventListener("focus", passwordFocused);
    passwordInput.addEventListener("blur", passwordNotFocused);

    return () => {
      passwordInput.removeEventListener("focus", passwordFocused);
      passwordInput.removeEventListener("blur", passwordNotFocused);
    };

  },[]);


  // Show password when show button pressed
  const handleShow = () => {
    if (buttonText === "Show") {
      setButtonText("Hide");
    } else {
      setButtonText("Show");
    };
  };


  return (
    <div className="signup-container">

      {/* Signup box */}
      <div className="signup-signup">

        <div className="signup-logo-wrapper">
          <img src={ logo } alt="Pintstagram" className="signup-logo" />
        </div>

        <div className="signup-text-wrapper">
         <p>Sign up to see photos and videos from your friends.</p>
        </div>

        <form className="signup-credentials" onSubmit={ handleSubmit }>
          <input
            placeholder="Email"
            onChange={ (e) => setEmail(e.target.value) }
            value={ email }
          />
          <input
            placeholder="Full Name"
            onChange={ (e) => setFullName(e.target.value) }
            value={ fullName }
          />
          <input
            placeholder="Username"
            onChange={ (e) => setUserName(e.target.value) }
            value={ userName }
          />
          <div className={ `signup-password-input ${ passwordFocus === true ? 'signup-password-highlight' : '' }` }>
            <input
              placeholder="Password"
              onChange={ (e) => setPassword(e.target.value) }
              value={ password }
              type={ buttonText === "Show" ? "password" : "" }
            />

            <div className="signup-password-show">
              <button type="button" onClick={ handleShow } className="signup-password-show-button">
                { password.length == 0 ? "" : buttonText }
              </button>
            </div>
          </div>
          
          <div className="signup-terms">
            <p>By signing up, you agree to our { <Link to="/terms" target="_blank">Terms</Link> } .</p>
          </div>

          <button disabled={ isLoading || !signupAllowed } className="signup-button">
            Sign up
          </button>

          <div className="signup-error-wrapper">
            { error && <div className="signup-error">{ error }</div> }
          </div>

        </form>

      </div>

      {/* Login box */}
      <div className="signup-login">
        <p>Have an account? { <Link to="/">Log in</Link> }</p>
      </div>

      {/* Linkedin Resume */}
      <div className="signup-linkedin">
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/maximilian-wu/">Pintstagram by Max Wu</a>
      </div>

    </div>
  );

};

export default Signup;
