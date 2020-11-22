import firebase from "./firebase";
import { AVATARS } from "./constants";

class User {
    constructor(firebaseUser) {
        // initialise the local user state from the firebase user object
        this.username = firebaseUser.displayName;
        this.uid = firebaseUser.uid;
        this.coins = 1000;
        this.wins = 0;
        this.purchasedSkins = {};
        this.equippedSkin = "Blue";
        // initialise owned avatars
        Object.keys(AVATARS).forEach(key => {
            let avatar = AVATARS[key];
            if (avatar['price'] === 0) this.purchasedSkins[key] = true;
        });
    }

    addUserToFirebaseStore() {
        // create a row in the firebase realtime database for this user
        // called on user registration
        firebase.database().ref('users/' + this.uid).set({
            username: this.username,
            coins: this.coins,
            purchasedSkins: this.purchasedSkins,
            wins: this.wins,
            equippedSkin: this.equippedSkin
        });
    }

    getFirebaseData(callback) {
        // update all local state from firebase
        var coins, wins, purchasedSkins, equippedSkin;
        firebase.database().ref('users/' + this.uid).once('value').then(function (snapshot) {
            coins = (snapshot.val() && snapshot.val().coins) || 0;
            wins = (snapshot.val() && snapshot.val().wins) || 0;
            purchasedSkins = (snapshot.val() && snapshot.val().purchasedSkins) || {};
            equippedSkin = (snapshot.val() && snapshot.val().equippedSkin) || "";
        }).then(() => {
            this.coins = coins;
            this.wins = wins;
            this.purchasedSkins = purchasedSkins;
            this.equippedSkin = equippedSkin;
        }).then(() => callback());
    }

    selectPurchasedSkin(avatar) {
        // equips an owned skin as the current skin for the user
        this.equippedSkin = avatar;

        // update state in firebase
        firebase.database().ref('users/' + this.uid).update({
            equippedSkin: this.equippedSkin,
        })
    }

    buySkin(avatar, price) {
        this.coins = this.coins - price;
        this.purchasedSkins[avatar] = true;

        // update state in firebase
        firebase.database().ref('users/' + this.uid).update({
            coins: this.coins,
            purchasedSkins: this.purchasedSkins,
        })
    }
}

export default User;