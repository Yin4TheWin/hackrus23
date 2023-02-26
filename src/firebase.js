// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBiU6lDFuSk9xKH3Eb_CXUAOyMASMRPJoo",
    authDomain: "hackrus23-91eab.firebaseapp.com",
    projectId: "hackrus23-91eab",
    storageBucket: "hackrus23-91eab.appspot.com",
    messagingSenderId: "431816092715",
    appId: "1:431816092715:web:237d5192c1834a88038e6e",
    measurementId: "G-VM62QR7CVN"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export {firebase}