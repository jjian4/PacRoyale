import React from "react";
import { useState, useContext } from "react";
import firebase from "./../../utils/firebase";
import User from "./../../utils/user";
import AppContext from "./../../contexts/AppContext";
import { SITE_NAME } from "../../utils/constants";
import "./Login.scss";

function Login() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
  const { goToMainMenu, setUser } = useContext(AppContext);

  const changeForm = (shouldShowRegister) => {
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
    setErrorMessage("");
    setShowRegisterForm(shouldShowRegister);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (credentials) {
        // on success, clear any existing errors and send user to main menu
        setErrorMessage("");
        // if the user is logged in, retrieve his info
        let newUser = new User(firebase.auth().currentUser);
        newUser.getFirebaseData(() => setUser(newUser));
        goToMainMenu();
      })
      .catch(function (error) {
        // Handle Login Errors here.
        setErrorMessage(error.message);
      });
  };

  const handleRegister = (event) => {
    event.preventDefault();

    // Validate username and passwords
    if (password !== confirmPassword) {
      setDoPasswordsMatch(false);
      return;
    }

    // clear input errors
    setDoPasswordsMatch(true);

    // register with Firebase
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function (credentials) {
        setErrorMessage("");

        // on successful registration, update username and log them in
        // redirect to main menu
        var firebaseUser = firebase.auth().currentUser;
        firebaseUser
          .updateProfile({
            displayName: username,
          })
          .then(function () {
            let newUser = new User(firebaseUser);
            newUser.addUserToFirebaseStore();
            setUser(newUser);
          })
          .then(function () {
            goToMainMenu();
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage, errorCode);
        setErrorMessage(error.message);
      });
  };



  return (
    <div className="Login">
      <div className="centeredForm">
        <div className="title">{SITE_NAME}</div>

        {/* LOGIN */}
        {!showRegisterForm && (
          <div>
            {errorMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setErrorMessage("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <form onSubmit={handleLogin}>
              <label className="formInput">
                <input
                  type="text"
                  placeholder="Email..."
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="formInput">
                <input
                  type="password"
                  placeholder="Password..."
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <input className="button" type="submit" value="Login" />
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
            {errorMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setErrorMessage("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <form onSubmit={handleRegister}>
              <label className="formInput">
                <input
                  type="text"
                  placeholder="Username..."
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

              <label className="formInput">
                <input
                  type="text"
                  placeholder="Email..."
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="formInput">
                <input
                  type="password"
                  placeholder="Password..."
                  autoComplete="new-password"
                  className={!doPasswordsMatch ? "formError" : ""}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <label className="formInput">
                <input
                  type="password"
                  placeholder="Confirm Password..."
                  autoComplete="new-password"
                  className={!doPasswordsMatch ? "formError" : ""}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div
                  className={doPasswordsMatch ? "invalid-feedback" : "feedback"}
                >
                  Passwords do not match.
                </div>
              </label>

              <input className="button" type="submit" value="Register" />
            </form>

            <div className="changeFormRow">
              Have an account?{" "}
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
