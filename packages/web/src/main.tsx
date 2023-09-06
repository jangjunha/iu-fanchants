import { initializeApp } from "firebase/app";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

initializeApp({
  apiKey: "AIzaSyB6IBO-aTWyoZQeIjYmZPjGQy_imFnzKBE",
  authDomain: "iu-fanchants.firebaseapp.com",
  projectId: "iu-fanchants",
  storageBucket: "iu-fanchants.appspot.com",
  messagingSenderId: "1087256727925",
  appId: "1:1087256727925:web:3d8527ef19dcfe4973833c",
  measurementId: "G-JB2HNH7102",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
