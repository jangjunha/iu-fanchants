import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB6IBO-aTWyoZQeIjYmZPjGQy_imFnzKBE",
  authDomain: "iu-fanchants.firebaseapp.com",
  projectId: "iu-fanchants",
  storageBucket: "iu-fanchants.appspot.com",
  messagingSenderId: "1087256727925",
  appId: "1:1087256727925:web:3d8527ef19dcfe4973833c",
  measurementId: "G-JB2HNH7102",
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export default app;
