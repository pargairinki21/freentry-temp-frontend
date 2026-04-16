import {
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../config/firebase.js";

const googleProvider = new GoogleAuthProvider();

// ── reCAPTCHA ────────────────────────────────────────────────────────────────
// Call once before sending OTP. Renders an invisible reCAPTCHA on `buttonId`.
export function initRecaptcha(buttonId) {
  if (window._recaptchaVerifier) {
    window._recaptchaVerifier.clear();
  }
  window._recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: "invisible",
  });
  return window._recaptchaVerifier;
}

// ── Phone Auth — Step 1: send OTP ────────────────────────────────────────────
export async function sendOtp(phoneNumber, recaptchaVerifier) {
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    recaptchaVerifier
  );
  // Store so step 2 can access it
  window._confirmationResult = confirmationResult;
  return confirmationResult;
}

// ── Phone Auth — Step 2: verify OTP ─────────────────────────────────────────
export async function verifyOtp(otp) {
  if (!window._confirmationResult) {
    throw new Error("No OTP sent yet. Please request an OTP first.");
  }
  const cred = await window._confirmationResult.confirm(otp);
  return cred.user;
}

// ── Update display name after phone login ────────────────────────────────────
export async function setDisplayName(displayName) {
  const user = auth.currentUser;
  if (user && displayName) await updateProfile(user, { displayName });
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function loginAnonymously() {
  const cred = await signInAnonymously(auth);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export async function getIdToken(forceRefresh = false) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  return user.getIdToken(forceRefresh);
}

export function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}
