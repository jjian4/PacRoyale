import firebase from "./firebase";
import { AVATARS } from "./constants";

class User {
  constructor(firebaseUser) {
    // initialize the local user state from the firebase user object
    this.username = firebaseUser.displayName;
    this.uid = firebaseUser.uid;
    this.coins = 1000;
    this.wins = 0;
    this.gamesPlayed = 0;
    this.purchasedSkins = {};
    this.equippedSkin = "Blue";
    this.dateJoined = Date.now();
    // initialize owned avatars
    Object.keys(AVATARS).forEach((key) => {
      let avatar = AVATARS[key];
      if (avatar["price"] === 0) this.purchasedSkins[key] = true;
    });
  }

  addUserToFirebaseStore() {
    // create a row in the firebase realtime database for this user
    // called on user registration
    firebase
      .database()
      .ref("users/" + this.uid)
      .set({
        username: this.username,
        coins: this.coins,
        purchasedSkins: this.purchasedSkins,
        wins: this.wins,
        gamesPlayed: this.gamesPlayed,
        equippedSkin: this.equippedSkin,
        dateJoined: this.dateJoined,
      });
  }

  getFirebaseData(callback) {
    // update all local state from firebase
    var coins, wins, purchasedSkins, equippedSkin;
    firebase
      .database()
      .ref("users/" + this.uid)
      .once("value")
      .then(function (snapshot) {
        coins = (snapshot.val() && snapshot.val().coins) || 0;
        wins = (snapshot.val() && snapshot.val().wins) || 0;
        purchasedSkins =
          (snapshot.val() && snapshot.val().purchasedSkins) || {};
        equippedSkin = (snapshot.val() && snapshot.val().equippedSkin) || "";
      })
      .then(() => {
        this.coins = coins;
        this.wins = wins;
        this.purchasedSkins = purchasedSkins;
        this.equippedSkin = equippedSkin;
      })
      .then(() => callback());
  }

  selectPurchasedSkin(avatar) {
    // equips an owned skin as the current skin for the user
    this.equippedSkin = avatar;

    // update state in firebase
    firebase
      .database()
      .ref("users/" + this.uid)
      .update({
        equippedSkin: this.equippedSkin,
      });
  }

  buySkin(avatar, price) {
    this.coins = this.coins - price;
    this.purchasedSkins[avatar] = true;

    // update state in firebase
    firebase
      .database()
      .ref("users/" + this.uid)
      .update({
        coins: this.coins,
        purchasedSkins: this.purchasedSkins,
      });
  }

  incrementWins() {
    this.wins = this.wins + 1;
    firebase
      .database()
      .ref("users/" + this.uid)
      .update({
        wins: this.wins,
      });
  }

  incrementCoins(coinsWon) {
    this.coins = this.coins + coinsWon;
    firebase
      .database()
      .ref("users/" + this.uid)
      .update({
        coins: this.coins,
      });
  }

  incrementGamesPlayed() {
    this.gamesPlayed = this.gamesPlayed + 1;
    firebase
      .database()
      .ref("users/" + this.uid)
      .update({
        gamesPlayed: this.gamesPlayed,
      });
  }
}

export default User;
