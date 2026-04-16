import { initializeApp, getApps, deleteApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfigProd, firebaseConfigDev } from "./config.js";

let app;
let auth;

/**
 * @param {"dev" | "prod"} env
 */
export function initFirebase(env = "prod") {
  const config = env === "dev" ? firebaseConfigDev : firebaseConfigProd;

  
  if (getApps().length > 0) {
    deleteApp(getApps()[0]);
  }

  app = initializeApp(config);
  auth = getAuth(app);

  return auth;
}

export function getAuthInstance() {
  if (!auth) {
    throw new Error("Firebase not initialized. Call initFirebase() first.");
  }
  return auth;
}