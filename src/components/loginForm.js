import {
  initRecaptcha,
  sendOtp,
  verifyOtp,
  loginWithGoogle,
  loginAnonymously,
} from "../services/auth.service.js";
import { showMessage, setButtonLoading, parseFirebaseError } from "../utils/ui.utils.js";
import { showTokenCard } from "./tokenCard.js";

export function initLoginForm() {
  document.getElementById("btn-send-otp").addEventListener("click", handleSendOtp);
  document.getElementById("btn-verify-otp").addEventListener("click", handleVerifyOtp);
  document.getElementById("login-otp").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleVerifyOtp();
  });

  document.getElementById("btn-login-google").addEventListener("click", handleGoogleLogin);
  document.getElementById("btn-login-anon").addEventListener("click", handleAnonLogin);
}

// ── Step 1: Send OTP ──────────────────────────────────────────────────────────
async function handleSendOtp() {
  const btn = document.getElementById("btn-send-otp");
  const phone = document.getElementById("login-phone").value.trim();

  if (!phone) {
    return showMessage("msg-login", "error", "Please enter a phone number.");
  }
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
    return showMessage("msg-login", "error", "Use E.164 format — e.g. +919876543210");
  }

  setButtonLoading(btn, true);
  try {
    const recaptcha = initRecaptcha("btn-send-otp");
    await sendOtp(phone, recaptcha);
    showOtpStep();
    showMessage("msg-login", "success", `OTP sent to ${phone}`);
  } catch (e) {
    showMessage("msg-login", "error", parseFirebaseError(e));
    if (window._recaptchaVerifier) {
      window._recaptchaVerifier.clear();
      window._recaptchaVerifier = null;
    }
  } finally {
    setButtonLoading(btn, false, "Send OTP →");
  }
}

// ── Step 2: Verify OTP ────────────────────────────────────────────────────────
async function handleVerifyOtp() {
  const btn = document.getElementById("btn-verify-otp");
  const otp = document.getElementById("login-otp").value.trim();

  if (!otp || otp.length < 4) {
    return showMessage("msg-login", "error", "Enter the OTP you received.");
  }

  setButtonLoading(btn, true);
  try {
    const user = await verifyOtp(otp);
    showMessage("msg-login", "success", "Phone verified!");
    await showTokenCard(user);
  } catch (e) {
    showMessage("msg-login", "error", parseFirebaseError(e));
  } finally {
    setButtonLoading(btn, false, "Verify & Sign In →");
  }
}

// ── Google ────────────────────────────────────────────────────────────────────
async function handleGoogleLogin() {
  try {
    const user = await loginWithGoogle();
    await showTokenCard(user);
  } catch (e) {
    showMessage("msg-login", "error", parseFirebaseError(e));
  }
}

// ── Anonymous ─────────────────────────────────────────────────────────────────
async function handleAnonLogin() {
  try {
    const user = await loginAnonymously();
    await showTokenCard(user);
  } catch (e) {
    showMessage("msg-login", "error", parseFirebaseError(e));
  }
}

// ── UI step toggle ────────────────────────────────────────────────────────────
function showOtpStep() {
  document.getElementById("step-phone").style.display = "none";
  document.getElementById("step-otp").style.display = "block";
  document.getElementById("login-otp").focus();
}
