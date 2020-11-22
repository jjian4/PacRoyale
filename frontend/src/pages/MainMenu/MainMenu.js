import React from "react";
import { useState, useEffect, useContext } from "react";
import firebase from "./../../utils/firebase";
import Modal from "../../components/Modal/Modal";
import AppContext from "./../../contexts/AppContext";
import JoinGame from "./../../modals/JoinGame/JoinGame";
import GameSettings from "./../../modals/GameSettings/GameSettings";
import Store from "./../../modals/Store/Store";
import About from "../../modals/About/About";
import { AVATARS, SITE_NAME } from "../../utils/constants";
import "./MainMenu.scss";

function MainMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  let topRightRef;

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const [showGameSettingsModal, setShowGameSettingsModal] = useState(false);
  const [showJoinGameModal, setJoinGameModal] = useState(false);

  const { goToLogin, user, isUserLoaded } = useContext(AppContext);

  useEffect(() => {
    // Called on component mount
    window.addEventListener("mousedown", handleClickOutside);
    // Returned function called on component unmount
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        goToLogin();
      })
      .catch(function (error) {
        // An error happened.
        console.log(error);
      });
  };

  // Detect outside click to close dropdown
  const handleClickOutside = (event) => {
    if (topRightRef && !topRightRef.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const closeModal = () => {
    setShowProfileModal(false);
    setShowStoreModal(false);
    setShowAboutModal(false);
    setShowGameSettingsModal(false);
    setJoinGameModal(false);
  };

  return (
    <div className="MainMenu">
      <div
        className="menuTopRight"
        onClick={() => setShowDropdown(!showDropdown)}
        ref={(node) => (topRightRef = node)}
      >
        {isUserLoaded && (
          <>
            <div className="profileButton avatar" style={AVATARS[user.equippedSkin].style}>
              <div className="avatarMouth" />
            </div>
            <div className="profileButtonLabel">{user.username}</div>
          </>
        )}

        {showDropdown && (
          <div className="profileDropdown">
            <div onClick={() => setShowProfileModal(true)}>Profile</div>
            <div onClick={() => setShowStoreModal(true)}>Store</div>
            <div onClick={() => setShowAboutModal(true)}>About this Game</div>
            <div onClick={logOut}>Logout</div>
          </div>
        )}
      </div>

      <div className="centeredMenu">
        <div className="title">{SITE_NAME}</div>
        <div className="menuButtons">
          <button
            className="button"
            onClick={() => setShowGameSettingsModal(true)}
          >
            Create Game
          </button>
          <button className="button" onClick={() => setJoinGameModal(true)}>
            Join Game
          </button>
          <button className="button" onClick={() => setShowAboutModal(true)}>
            How to Play
          </button>
        </div>
      </div>

      <Modal isOpen={showProfileModal} onClose={closeModal} title="jjian">
        My Profile
      </Modal>
      <Modal isOpen={showStoreModal} onClose={closeModal} title="Store">
        <Store />
      </Modal>
      <Modal isOpen={showAboutModal} onClose={closeModal} title={SITE_NAME}>
        <About />
      </Modal>
      <Modal
        isOpen={showGameSettingsModal}
        onClose={closeModal}
        title="Game Settings"
      >
        <GameSettings />
      </Modal>
      <Modal isOpen={showJoinGameModal} onClose={closeModal} title="Join Game">
        <JoinGame />
      </Modal>

      {/* <audio loop className='menuMusic'>
        <source src="../../../sounds/menu-music.mp3" type="audio/mpeg" />
      </audio> */}
    </div>
  );
}

export default MainMenu;
