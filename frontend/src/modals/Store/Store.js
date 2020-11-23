import React from "react";
import { useState, useEffect, useContext } from "react";
import { AVATARS } from "./../../utils/constants";
import AppContext from "./../../contexts/AppContext";
import "./Store.scss";

function Store() {
  const { user } = useContext(AppContext);
  const [purchasedSkins, setSkins] = useState({});
  const [equippedSkin, setEquipped] = useState({});
  const [coins, setCoins] = useState(1000);
  const [error, setError] = useState(false);

  useEffect(() => {
    setSkins(user.purchasedSkins);
    setEquipped(user.equippedSkin);
    setCoins(user.coins);
  }, [user.equippedSkin, user.purchasedSkins, user.coins]);

  const buyItem = (avatar) => {
    let price = AVATARS[avatar].price;
    if (price > coins) {
      setError(true);
      return;
    }
    let updatedSkins = purchasedSkins;
    updatedSkins[avatar] = true;
    setCoins(coins - price);
    setSkins(updatedSkins);
    setError(false);
    user.buySkin(avatar, price);
  };

  const equipItem = (avatar) => {
    // equip item, update database with user's preference
    setEquipped(avatar);
    setError(false);
    user.selectPurchasedSkin(avatar);
  };

  return (
    <div className="Store">
      <div className="coins">
        <div>My coins: {user.coins}</div>
      </div>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          You do not own enough coins to purchase this item.
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={() => setError(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <div className="storeItems">
        <div className="row">
          {Object.keys(AVATARS).map((avatar, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <div className="storeItem">
                <div className="itemName">{avatar}</div>
                <div className="itemBox">
                  <div className="avatar" style={AVATARS[avatar].style}>
                    <div className="avatarMouth" />
                  </div>
                </div>
                {/* Skin is currently selected */}
                {avatar in purchasedSkins && avatar === equippedSkin && (
                  <div>(Selected)</div>
                )}
                {/* Skin is owned but not selected */}
                {avatar in purchasedSkins && !(avatar === equippedSkin) && (
                  <div className="itemButton">
                    <div onClick={() => equipItem(avatar)}>SELECT</div>
                  </div>
                )}
                {/* Skin not owned and can be bought */}
                {!(avatar in purchasedSkins) && (
                  <div className="itemButton">
                    <div onClick={() => buyItem(avatar)}>
                      {AVATARS[avatar].price} coins
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Store;
