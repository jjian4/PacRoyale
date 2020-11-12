import React from "react";
import "./SplashScreen.scss";

function SplashScreen() {
  return (
    // Adapted from https://codepen.io/nxworld/pen/zwGpXr
    <div className="splashScreen">
      <div className="loading loading08">
        <span data-text="L">L</span>
        <span data-text="O">O</span>
        <span data-text="A">A</span>
        <span data-text="D">D</span>
        <span data-text="I">I</span>
        <span data-text="N">N</span>
        <span data-text="G">G</span>
      </div>
    </div>
  );
}

export default SplashScreen;
