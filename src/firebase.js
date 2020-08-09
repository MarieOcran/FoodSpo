import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyDuKBHmxoId4IDQmvv0stATVlK8fxNvrHE",
        authDomain: "food-spo.firebaseapp.com",
        databaseURL: "https://food-spo.firebaseio.com",
        projectId: "food-spo",
        storageBucket: "food-spo.appspot.com",
        messagingSenderId: "413061155522",
        appId: "1:413061155522:web:794088bd3af0635d30095b",
        measurementId: "G-V1MY37WS94"
     
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};