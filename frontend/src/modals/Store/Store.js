import React from "react";
import { useState, useContext } from "react";
import { AVATARS } from "./../../utils/constants";
import AppContext from "./../../contexts/AppContext";
import "./Store.scss";

function Store() {
    // TODO; get numCoins from database
    const { user } = useContext(AppContext);

    const buyItem = () => {
        // TODO: subtract coins, update database, set skin as selected
    }

    const equipItem = () => {
        // TODO: equip item, update database with user's preference
    }

    return (
        <div className='Store'>
            <div className='coins'>
                <div>
                    My coins: {user.coins}
                </div>
            </div>
            <div className='storeItems'>
                <div className='row'>
                    {Object.keys(user.purchasedSkins).map((avatar, index) => (
                        <div className='col-md-4' key={index}>
                            <div className='storeItem'>
                                <div className='itemName'>
                                    {avatar}
                                </div>
                                <div className='itemBox'>
                                    <div className='avatar' style={user.purchasedSkins[avatar].style}>
                                      <div className='avatarMouth'/>
                                    </div>
                                </div>
                                {/* TODO: If already owned and already selected */}
                                {(user.purchasedSkins[avatar].owned) && (user.purchasedSkins[avatar].selected) && (
                                    <div>(Selected)</div>
                                )}
                                {/* TODO: If already owned but not selected */}
                                {user.purchasedSkins[avatar].owned && (!user.purchasedSkins[avatar].selected) && (
                                    <div className='itemButton'><div onClick={equipItem}>SELECT</div></div>
                                )}
                                {/* If not owned yet */}
                                {!user.purchasedSkins[avatar].owned && (
                                <div className='itemButton'><div onClick={buyItem}>{user.purchasedSkins[avatar].price} coins</div></div>
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