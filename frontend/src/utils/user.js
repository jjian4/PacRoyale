import firebase from "./firebase";
import { AVATARS } from "./constants";

class User {

    constructor(firebaseUser) {
        // initialise the local user state from the firebase user object
        console.log(firebaseUser);
        this.username = firebaseUser.displayName;
        this.uid = firebaseUser.uid;
        this.coins = 50;
        this.wins = 0;
        this.purchasedSkins = {};
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
}

export default User;