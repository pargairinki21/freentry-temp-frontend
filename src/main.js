import { initFirebase } from "./config/firebase.js";

import { onAuthChanged } from "./services/auth.service.js";
import { initTabs } from "./components/tabs.js";
import { initLoginForm } from "./components/loginForm.js";
import { initSignupForm } from "./components/signupForm.js";
import { initTokenCard, showTokenCard, hideTokenCard } from "./components/tokenCard.js";

// 🌍 Get env (persisted or default)
const currentEnv = localStorage.getItem("env") || "dev";

// 🔥 Initialize Firebase FIRST
initFirebase(currentEnv);

// 🎛️ Setup dropdown (top-right)
function setupEnvSwitcher() {
  const dropdown = document.getElementById("env-select");

  if (!dropdown) return;

  // set current value
  dropdown.value = currentEnv;

  dropdown.addEventListener("change", (e) => {
    const selectedEnv = e.target.value;

    // save selection
    localStorage.setItem("env", selectedEnv);

    // reload to re-init Firebase cleanly
    location.reload();
  });
}

function bootstrap() {
  setupEnvSwitcher(); // 👈 ADD THIS

  initTabs();
  initLoginForm();
  initSignupForm();
  initTokenCard();

  // Restore session on page reload
  onAuthChanged(async (user) => {
    if (user) {
      await showTokenCard(user);
    } else {
      hideTokenCard();
    }
  });
}

bootstrap();