import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWhD4IJmcM0EJyOAkxHRXXne-z-pj1Ipg",
  authDomain: "freentry-1a101.firebaseapp.com",
  databaseURL: "https://freentry-1a101-default-rtdb.firebaseio.com",
  projectId: "freentry-1a101",
  storageBucket: "freentry-1a101.firebasestorage.app",
  messagingSenderId: "64608347025",
  appId: "1:64608347025:web:9cc65eb8b076a7c14db030",
  measurementId: "G-BZ9Y2M4SKT"
};

const firebaseConfigDev = {
  apiKey: "AIzaSyCsotnHOpy_wZyEFLMORt0Cz29RH4KfF2U",
  authDomain: "freentry-dev.firebaseapp.com",
  databaseURL: "https://freentry-dev-default-rtdb.firebaseio.com",
  projectId: "freentry-dev",
  storageBucket: "freentry-dev.firebasestorage.app",
  messagingSenderId: "967546904351",
  appId: "1:967546904351:web:0db893c6274e8a27e5da2a",
  measurementId: "G-49WRW8GEZH"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
