import {
  initRecaptcha,
  sendOtp,
  verifyOtp,
  setDisplayName,
} from "../services/auth.service.js";
import { showMessage, setButtonLoading, parseFirebaseError } from "../utils/ui.utils.js";
import { showTokenCard } from "./tokenCard.js";

export function initSignupForm() {
  document.getElementById("btn-signup-send-otp").addEventListener("click", handleSendOtp);
  document.getElementById("btn-signup-verify-otp").addEventListener("click", handleVerifyOtp);
  document.getElementById("signup-otp").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleVerifyOtp();
  });
}

// ── Step 1: Send OTP ──────────────────────────────────────────────────────────
async function handleSendOtp() {
  const btn = document.getElementById("btn-signup-send-otp");
  const phone = document.getElementById("signup-phone").value.trim();

  if (!phone) {
    return showMessage("msg-signup", "error", "Please enter a phone number.");
  }
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
    return showMessage("msg-signup", "error", "Use E.164 format — e.g. +919876543210");
  }

  setButtonLoading(btn, true);
  try {
    const recaptcha = initRecaptcha("btn-signup-send-otp");
    await sendOtp(phone, recaptcha);
    showOtpStep();
    showMessage("msg-signup", "success", `OTP sent to ${phone}`);
  } catch (e) {
    showMessage("msg-signup", "error", parseFirebaseError(e));
    if (window._recaptchaVerifier) {
      window._recaptchaVerifier.clear();
      window._recaptchaVerifier = null;
    }
  } finally {
    setButtonLoading(btn, false, "Send OTP →");
  }
}

// ── Step 2: Verify OTP + set display name ────────────────────────────────────
async function handleVerifyOtp() {
  const btn = document.getElementById("btn-signup-verify-otp");
  const otp = document.getElementById("signup-otp").value.trim();
  const name = document.getElementById("signup-name").value.trim();

  if (!otp || otp.length < 4) {
    return showMessage("msg-signup", "error", "Enter the OTP you received.");
  }

  setButtonLoading(btn, true);
  try {
    const user = await verifyOtp(otp);
    if (name) await setDisplayName(name);
    showMessage("msg-signup", "success", "Account created!");
    await showTokenCard(user);
  } catch (e) {
    showMessage("msg-signup", "error", parseFirebaseError(e));
  } finally {
    setButtonLoading(btn, false, "Verify & Create Account →");
  }
}

// ── UI step toggle ────────────────────────────────────────────────────────────
function showOtpStep() {
  document.getElementById("signup-step-phone").style.display = "none";
  document.getElementById("signup-step-otp").style.display = "block";
  document.getElementById("signup-otp").focus();
}
