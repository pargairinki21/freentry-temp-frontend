import { getIdToken, logout } from "../services/auth.service.js";
import { setText, copyToClipboard, flashLabel } from "../utils/ui.utils.js";

let _currentUser = null;
let _currentToken = null;

export function initTokenCard() {
  document.getElementById("btn-copy-token").addEventListener("click", () => {
    copyToClipboard(
      _currentToken,
      document.getElementById("btn-copy-token"),
      "✓ Token Copied!"
    );
  });

  document.getElementById("btn-copy-uid").addEventListener("click", () => {
    copyToClipboard(
      _currentUser?.uid,
      document.getElementById("btn-copy-uid"),
      "✓ UID Copied!"
    );
  });

  document.getElementById("btn-signout").addEventListener("click", async () => {
    await logout();
    hideTokenCard();
  });

  document.getElementById("btn-refresh-token").addEventListener("click", async () => {
    try {
      _currentToken = await getIdToken(true);
      setText("out-token", _currentToken);
      flashLabel(
        document.getElementById("btn-refresh-token"),
        "✓ Token Refreshed",
        2000
      );
    } catch (e) {
      console.error("Refresh failed", e);
    }
  });
}

export async function showTokenCard(user) {
  _currentUser = user;
  _currentToken = await getIdToken();

  setText("out-uid", user.uid);
  setText("out-name", user.displayName || "(none)");
  setText("out-email", user.phoneNumber || user.email || "(anonymous)");
  setText("out-provider", user.providerData[0]?.providerId || "anonymous");
  setText("out-verified", user.phoneNumber ? "✓ Yes (Phone)" : user.emailVerified ? "✓ Yes (Email)" : "✗ No");
  setText("out-token", _currentToken);
  setText("out-refresh", user.refreshToken);

  document.getElementById("token-card").classList.add("visible");
}

export function hideTokenCard() {
  document.getElementById("token-card").classList.remove("visible");
  _currentUser = null;
  _currentToken = null;
}
