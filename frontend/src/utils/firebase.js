import firebase from 'firebase'
import { firebaseConfig } from './constants.js'

firebase.initializeApp(firebaseConfig);

export default firebase;

