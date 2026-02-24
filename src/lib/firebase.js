import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDSYZAVeu9l4ELoNrA03y6MURSLde_dg10",
    authDomain: "raftguru-f95ba.firebaseapp.com",
    projectId: "raftguru-f95ba",
    storageBucket: "raftguru-f95ba.firebasestorage.app",
    messagingSenderId: "850082505966",
    appId: "1:850082505966:web:dfd3d4603814555aa2ffff"
}

const app = initializeApp(firebaseConfig)
export const firestore = getFirestore(app)
export const auth = getAuth(app)
