import React from "react";
import { useState, useEffect, useContext } from "react";
import firebase from "./../../utils/firebase";
import Modal from "../../components/Modal/Modal";
import AppContext from "./../../contexts/AppContext";
import "./MainMenu.scss";
import JoinGame from "./../../modals/JoinGame/JoinGame";
import GameSettings from "./../../modals/GameSettings/GameSettings";

function MainMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  let topRightRef;

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const [showGameSettingsModal, setShowGameSettingsModal] = useState(false);
  const [showJoinGameModal, setJoinGameModal] = useState(false);

  const { goToLogin, isHost } = useContext(AppContext);

  useEffect(() => {
    // Called on component mount
    window.addEventListener("mousedown", handleClickOutside);

    // Returned function called on component unmount
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

const logOut = () => {
  
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    goToLogin();
  }).catch(function(error) {
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
        <div className="profileButton"></div>
        <div className="profileButtonLabel">jjian</div>
        {showDropdown && (
          <div className="profileDropdown">
            {/* TODO: Make Profile modal */}
            <div>Profile</div>
            <div onClick={() => setShowProfileModal(true)}>Profile</div>
            <div onClick={() => setShowStoreModal(true)}>Store</div>
            <div onClick={() => setShowAboutModal(true)}>About this Game</div>
            <div onClick={logOut}>Logout</div>
          </div>
        )}
      </div>
      <div className="centeredMenu">
        <div className="title">493 Battle Royale</div>
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
          <button className="button">Store</button>
        </div>
      </div>
      <Modal isOpen={showProfileModal} onClose={closeModal} title="jjian">
        Profile
      </Modal>
      <Modal isOpen={showStoreModal} onClose={closeModal} title="Store">
        Store
      </Modal>
      <Modal isOpen={showAboutModal} onClose={closeModal} title="About">
        About
      </Modal>
      <Modal
        isOpen={showGameSettingsModal}
        onClose={closeModal}
        title="Game Settings"
      >
        <GameSettings />
      </Modal>
      <Modal isOpen={showJoinGameModal} onClose={closeModal} title="About">
        <JoinGame />
      </Modal>
    </div>
  );
}

export default MainMenu;
