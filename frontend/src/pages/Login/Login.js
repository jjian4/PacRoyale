import React from "react";
import { useState, useContext } from "react";
import AppContext from "./../../contexts/AppContext";
import "./Login.scss";

function Login() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { goToMainMenu } = useContext(AppContext);

  const changeForm = shouldShowRegister => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowRegisterForm(shouldShowRegister);
  }

  const handleLogin = event => {
    event.preventDefault();

    console.log(username);
    console.log(password);

    // TODO: Firebase authentication
    console.log('TODO: Firebase authentication')

    goToMainMenu();
  }

  const handleRegister = event => {
    event.preventDefault();

    console.log(username);
    console.log(password);
    console.log(confirmPassword);

    // TODO: Input verification
    console.log('TODO: Input verification')

    // TODO: Firebase registration
    console.log('TODO: Firebase registration')

    goToMainMenu();
  }

  return (
    <div className="Login">
      <div className="centeredForm">
        <div className="title">493 Battle Royale</div>

        {/* LOGIN */}
        {!showRegisterForm && (
          <div>
            <form onSubmit={handleLogin}>
              <label className="formInput">
                <input
                  type="text"
                  placeholder="Username..."
                  autoComplete='username'
                  onChange={e => setUsername(e.target.value)}
                />
              </label>

              <label className="formInput">
                <input
                  type="password"
                  placeholder="Password..."
                  autoComplete='current-password'
                  onChange={e => setPassword(e.target.value)}
                />
              </label>

              <input className='button' type='submit' value='Login' />
            </form>

            <div className="changeFormRow">
              Don't have an account?{" "}
              <span className="link" onClick={() => changeForm(true)}>
                Register Now!
              </span>
            </div>
          </div>
        )}

        {/* REGISTER */}
        {showRegisterForm && (
          <div>
            <form onSubmit={handleRegister}>
              <label className="formInput">
                <input
                  type="text"
                  placeholder="Username..."
                  autoComplete='username'
                  onChange={e => setUsername(e.target.value)}
                />
              </label>

              <label className="formInput">
                <input
                  type="password"
                  placeholder="Password..."
                  autoComplete='new-password'
                  onChange={e => setPassword(e.target.value)}
                />
              </label>

              <label className="formInput">
                <input
                  type="password"
                  placeholder="Confirm Password..."
                  autoComplete='new-password'
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </label>

              <input className='button' type='submit' value='Register' />
            </form>

            <div className="changeFormRow">
              Have an account? {" "}
              <span className="link" onClick={() => changeForm(false)}>
                Sign In!
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;
