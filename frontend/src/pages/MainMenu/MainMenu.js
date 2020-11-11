import React from "react";
import { useState, useEffect, useContext } from "react";
import Modal from "../../components/Modal/Modal";
import AppContext from "./../../contexts/AppContext";
import "./MainMenu.scss";

function MainMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  let topRightRef;

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const [showGameSettingsModal, setShowGameSettingsModal] = useState(false);

  const { goToLogin, goToLobby } = useContext(AppContext);

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

  const closeModal = () => {
    setShowProfileModal(false);
    setShowStoreModal(false);
    setShowAboutModal(false);
    setShowGameSettingsModal(false);
  }

  return (
    <div className='MainMenu'>
      <div
        className='menuTopRight'
        onClick={() => setShowDropdown(!showDropdown)}
        ref={(node) => topRightRef = node}
      >
        <div className='profileButton avatar avatar-blue'></div>
        <div className='profileButtonLabel'>jjian</div>

        {showDropdown && (
          <div className='profileDropdown'>
            {/* TODO: Make Profile modal */}
            <div onClick={() => setShowProfileModal(true)}>Profile</div>
            <div onClick={() => setShowStoreModal(true)}>Store</div>
            <div onClick={() => setShowAboutModal(true)}>About this Game</div>
            {/* TODO: Log out user, don't just go to login page */}
            <div onClick={goToLogin}>Logout</div>
          </div>
        )}
      </div>

      <div className="centeredMenu">
        <div className="title">493 Battle Royale</div>
        <div className='menuButtons'>
          <button className='button' onClick={() => setShowGameSettingsModal(true)}>Create Game</button>
          <button className='button'>Join Game</button>
          <button className='button'>Store</button>

          {/* REMOVE */}
          <button className='button' onClick={goToLobby}>Lobby (for testing, will remove)</button>
        </div>
      </div>


      <Modal
        isOpen={showProfileModal}
        onClose={closeModal}
        title='jjian'
      >
        hellooooo
      </Modal>

      <Modal
        isOpen={showStoreModal}
        onClose={closeModal}
        title='Store'
      >
        heloo
      </Modal>

      <Modal
        isOpen={showAboutModal}
        onClose={closeModal}
        title='About'
      >
        hellooo
      </Modal>

      <Modal
        isOpen={showGameSettingsModal}
        onClose={closeModal}
        title='Game Settings'
      >
        game
      </Modal>

    </div>
  );
}

export default MainMenu;
