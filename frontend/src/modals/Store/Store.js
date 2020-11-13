import React from "react";
import { useState } from "react";
import { AVATARS } from "./../../utils/constants";
import "./Store.scss";

function Store() {
  // TODO; get numCoins from database
  const [numCoins, setNumCoins] = useState(5000);

  const buyItem = () => {
    // TODO: subtract coins, update database, set skin as selected
  };

  const equipItem = () => {
    // TODO: equip item, update database with user's preference
  };

  return (
    <div className="Store">
      <div className="coins">
        <div>My coins: {numCoins}</div>
      </div>
      <div className="storeItems">
        <div className="row">
          {Object.keys(AVATARS).map((avatar, index) => (
            <div className="col-md-4" key={index}>
              <div className="storeItem">
                <div className="itemName">{avatar}</div>
                <div className="itemBox">
                  <div className="avatar" style={AVATARS[avatar].style}>
                    <div className="avatarMouth" />
                  </div>
                </div>
                {/* TODO: If already owned and already selected */}
                {false && <div>(Selected)</div>}
                {/* TODO: If already owned but not selected */}
                {false && (
                  <div className="itemButton">
                    <div onClick={equipItem}>SELECT</div>
                  </div>
                )}
                {/* If not owned yet */}
                <div className="itemButton">
                  <div onClick={buyItem}>{AVATARS[avatar].price} coins</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Store;
