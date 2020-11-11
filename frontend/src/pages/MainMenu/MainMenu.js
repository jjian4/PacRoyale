import React from "react";
import { useState, useEffect, useContext } from "react";
import PageTransitionContext from "./../../contexts/PageTransitionContext";
import "./MainMenu.scss";

function MainMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  let topRightRef;

  const { goToStore } = useContext(PageTransitionContext);
  const { goToAbout } = useContext(PageTransitionContext);
  const { goToLogin } = useContext(PageTransitionContext);

  useEffect(() => {
    // Called on component mount
    window.addEventListener('mousedown', handleClickOutside);

    // Returned function called on component unmount 
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }

  });

  // Detect outside click to close dropdown
  const handleClickOutside = event => {
    if (topRightRef && !topRightRef.contains(event.target)) {
      setShowDropdown(false);
    }
  }

  return (
    <div className='MainMenu'>

      <div className='menuTopRight' onClick={() => setShowDropdown(!showDropdown)} ref={(node) => topRightRef = node}>
        <div className='profileButton'></div>
        <div className='profileButtonLabel'>jjian</div>

        {showDropdown && (
          <div className='profileDropdown'>
            {/* TODO: Make Profile modal */}
            <div>Profile</div>
            <div onClick={goToStore}>Store</div>
            <div onClick={goToAbout}>About this Game</div>
            {/* TODO: Log out user, don't just go to login page */}
            <div onClick={goToLogin}>Logout</div>
          </div>
        )}
      </div>

      <div className="centeredMenu">
        <div className="title">493 Battle Royale</div>
        <div className='menuButtons'>
          <button className='button'>Create Game</button>
          <button className='button'>Join Game</button>
          <button className='button'>Store</button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
