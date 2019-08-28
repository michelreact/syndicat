
import Rebase from 're-base'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

// Initialize Firebase
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDfJ96jbepSKGlLSu1VS9tn3_9mpZ_F9Iw",
    authDomain: "monsyndicat-e9f90.firebaseapp.com",
    databaseURL: "https://monsyndicat-e9f90.firebaseio.com",
    projectId: "monsyndicat-e9f90",
    storageBucket: "monsyndicat-e9f90.appspot.com",
    messagingSenderId: "930426929552",
    appId: "1:930426929552:web:4ad22e2f5c159dae"
})

// mise en place de rebase
const base = Rebase.createClass(firebase.database())

// utilisation de documents ou d'image dans firebase
const storage = firebase.storage()

// database classique
const db = firebaseApp.database()

// export des différentes variables
export { firebaseApp, storage, db }


export default base

// test github 2

