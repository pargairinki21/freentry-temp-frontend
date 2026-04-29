import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, firebaseConfigDev } from './config.js';

const app = initializeApp(firebaseConfigDev);
export const auth = getAuth(app);
