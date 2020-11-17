import firebase from "./firebase";
import { AVATARS } from "./constants";

class User {

    constructor(firebaseUser) {
        // initialise the local user state from the firebase user object
        this.username = firebaseUser.displayName;
        this.uid = firebaseUser.uid;
        this.coins = 100;
        this.wins = 0;
        this.purchasedSkins = {};
        // initialise owned avatars
        Object.keys(AVATARS).forEach(key => {
            let avatar = AVATARS[key];
            avatar['owned'] = avatar.price === 0;
            avatar['selected'] = key === "Blue";
            this.purchasedSkins[key] = avatar;
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
          });
    }

    getFirebaseData() {
        // update all local state from firebase
        var coins, wins, purchasedSkins;
        firebase.database().ref('users/' + this.uid).once('value').then(function(snapshot) {
            coins = (snapshot.val() && snapshot.val().coins) || 0;
            wins = (snapshot.val() && snapshot.val().wins) || 0;
            purchasedSkins = (snapshot.val() && snapshot.val().purchasedSkins) || {};
        }).then( () => {
            this.coins = coins;
            this.wins = wins;
            this.purchasedSkins = purchasedSkins;
        });
       
    }

    getCoins() {
        // gets the update value of coins from firebase
        var coins = 0;
        firebase.database().ref('users/' + this.uid).once('value').then(function(snapshot) {
            coins = (snapshot.val() && snapshot.val().coins) || 0;
        });
        this.coins = coins;
    }

    getWins() {
        // gets the update value of wins from firebase
        var wins = 0;
        firebase.database().ref('users/' + this.uid).once('value').then(function(snapshot) {
            wins = (snapshot.val() && snapshot.val().wins) || 0;
        });
        this.wins = wins;
    }

    getPurchasedSkins() {
        // gets the update value of wins from firebase
        var skins = {};
        firebase.database().ref('users/' + this.uid).once('value').then(function(snapshot) {
            skins = (snapshot.val() && snapshot.val().purchasedSkins) || 0;
        });
        this.purchasedSkins = skins;
    }
}

export default User;