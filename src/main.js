import { onAuthChanged } from "./services/auth.service.js";
import { initTabs } from "./components/tabs.js";
import { initLoginForm } from "./components/loginForm.js";
import { initSignupForm } from "./components/signupForm.js";
import { initTokenCard, showTokenCard, hideTokenCard } from "./components/tokenCard.js";

function bootstrap() {
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
