import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../../hooks/useSignup';
import './index.css';

// assets
import logo from '../../assets/pintstagram-logo.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error } = useSignup();
  const [signupAllowed, setSignupAllowed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, password, fullName);
  };

  // Login when fields are filled out
  useEffect(() => {
    if (email.length > 0 && password.length > 0 && fullName.length > 0) {
      setSignupAllowed(true);
    } else {
      setSignupAllowed(false);
    };
  }, [email.length, password.length, fullName.length]);

  return (
    <div className="signup-container">

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
            placeholder="Password"
            onChange={ (e) => setPassword(e.target.value) }
            value={ password }
          />

          <div className="signup-terms">
            <p>By signing up, you agree to our { <Link to="/terms">Terms</Link> } .</p>
          </div>

          <button disabled={ isLoading || !signupAllowed } className="signup-button">
            Sign up
          </button>

          <div className="signup-error-wrapper">
            { error && <div className="signup-error">{ error }</div> }
          </div>

        </form>

      </div>

      <div className="signup-login">
        <p>Have an account? { <Link to="/">Log in</Link> }</p>
      </div>

    </div>
  );

};

export default Signup;
