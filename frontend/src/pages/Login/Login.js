import React from "react";
import { useContext } from "react";
import "./Login.scss";
import PageTransitionContext from "./../../contexts/PageTransitionContext";

function Login() {
  const { goToMainMenu } = useContext(PageTransitionContext);
  return (
    <div className="Login">
      <button onClick={goToMainMenu}>GO TO MAIN MENU</button>
      <div className="centeredForm">
        <div className="title">493 Battle Royale</div>
        <form>
          <label className="formInput">
            <input type="text" placeholder="Username..." />
          </label>

          <label className="formInput">
            <input type="password" placeholder="Password..." />
          </label>
        </form>
        <div className="registerRow">
          Don't have an account?{" "}
          <span className="registerLink" onClick={() => console.log("TODO")}>
            Register Now!
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
